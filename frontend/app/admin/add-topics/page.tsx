"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAdminAuth } from "@/context/AdminAuthProvider";
import { allProvidedSubjects, departmentSubjects } from "@/lib/subjectCatalog";
import { API_BASE } from "@/lib/apiBase";
import AdminNavbar from "@/components/AdminNavbar";

type Subject = { id: string; name: string; department: string };

type TopicDraft = {
  title: string;
  description: string;
  content: string;
  imageUrl: string;
};

function parseCsv(text: string) {
  const [headerLine, ...lines] = text
    .split(/\r?\n/)
    .filter((line) => line.trim());
  const headers = headerLine.split(",").map((item) => item.trim());
  return lines.map((line) => {
    const cols = line.split(",");
    const row = {} as Record<string, string>;
    headers.forEach((key, index) => {
      row[key] = (cols[index] || "").trim();
    });
    return row;
  });
}

export default function AddTopicsPage() {
  const router = useRouter();
  const { loading, isAdmin } = useAdminAuth();
  const [dbSubjects, setDbSubjects] = useState<Subject[]>([]);
  const [selectedDepartment, setSelectedDepartment] =
    useState<string>("Science Department");
  const [selectedSubjectName, setSelectedSubjectName] = useState(
    allProvidedSubjects[0],
  );
  const [topics, setTopics] = useState<TopicDraft[]>([
    { title: "", description: "", content: "", imageUrl: "" },
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/admin/login");
    }
  }, [loading, isAdmin, router]);

  useEffect(() => {
    fetch(`${API_BASE}/api/catalog/subjects`)
      .then((res) => res.json())
      .then((data: Subject[]) => {
        setDbSubjects(data);
        if (data.length) {
          setSelectedDepartment(data[0].department || "Science Department");
        }
      })
      .catch(() => toast.error("Failed to load subjects"));
  }, []);

  const subjectMap = useMemo(() => {
    const map = new Map<string, Subject>();
    dbSubjects.forEach((subject) => map.set(subject.name, subject));
    return map;
  }, [dbSubjects]);

  const departments = useMemo(() => {
    const fromDb = dbSubjects
      .map((subject) => subject.department)
      .filter(Boolean);
    return Array.from(
      new Set<string>([
        ...Object.keys(departmentSubjects),
        ...fromDb,
        "General Department",
      ]),
    );
  }, [dbSubjects]);

  const subjectOptions = useMemo(() => {
    const dbFiltered = dbSubjects
      .filter((subject) => subject.department === selectedDepartment)
      .map((subject) => subject.name);
    if (dbFiltered.length) {
      return Array.from(new Set(dbFiltered)).sort((a, b) => a.localeCompare(b));
    }
    const preset = departmentSubjects[selectedDepartment] || [];
    return Array.from(new Set(preset)).sort((a, b) => a.localeCompare(b));
  }, [dbSubjects, selectedDepartment]);

  useEffect(() => {
    if (!subjectOptions.length) {
      setSelectedSubjectName("");
      return;
    }
    if (!subjectOptions.includes(selectedSubjectName)) {
      setSelectedSubjectName(subjectOptions[0]);
    }
  }, [selectedSubjectName, subjectOptions]);

  const ensureSubjectId = async (name: string) => {
    const existing = subjectMap.get(name);
    if (existing) return existing.id;
    const createRes = await fetch(`${API_BASE}/api/admin/subjects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        department: "General Department",
        description: "",
      }),
    });
    if (!createRes.ok) throw new Error("create subject failed");
    const created = (await createRes.json()) as Subject;
    setDbSubjects((prev) => [...prev, created]);
    return created.id;
  };

  const updateTopic = (
    index: number,
    field: keyof TopicDraft,
    value: string,
  ) => {
    setTopics((current) =>
      current.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const addTopicRow = () => {
    setTopics((current) => [
      ...current,
      { title: "", description: "", content: "", imageUrl: "" },
    ]);
  };

  const removeTopicRow = (index: number) => {
    setTopics((current) => current.filter((_, idx) => idx !== index));
  };

  const handleSaveTopic = async (event: FormEvent) => {
    event.preventDefault();
    const validTopics = topics.filter((topicItem) => topicItem.title.trim());
    if (!validTopics.length) {
      toast.error("Add at least one topic title before saving.");
      return;
    }
    setSaving(true);
    try {
      const subjectId = await ensureSubjectId(selectedSubjectName);
      const res = await fetch(`${API_BASE}/api/admin/topics/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subjectId,
          rows: validTopics.map((topicItem) => ({
            title: topicItem.title,
            description: topicItem.description.slice(0, 160),
            content: topicItem.content,
            imageUrl: topicItem.imageUrl,
          })),
        }),
      });
      if (!res.ok) throw new Error("failed");
      toast.success(`${validTopics.length} topic(s) saved`);
      setTopics([{ title: "", description: "", content: "", imageUrl: "" }]);
    } catch {
      toast.error("Failed to save topics");
    } finally {
      setSaving(false);
    }
  };

  const handleCsvUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const rows = parseCsv(text);
    if (!rows.length) {
      toast.error("CSV is empty");
      return;
    }
    setSaving(true);
    try {
      const subjectId = await ensureSubjectId(selectedSubjectName);
      const res = await fetch(`${API_BASE}/api/admin/topics/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subjectId, rows }),
      });
      if (!res.ok) throw new Error("failed");
      toast.success("Topics CSV uploaded");
    } catch {
      toast.error("Failed to upload topics CSV");
    } finally {
      setSaving(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <AdminNavbar />
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-md">
        <p className="text-sm text-emerald-200">Admin</p>
        <h1 className="mt-1 text-2xl font-bold md:text-3xl">
          Add Topics and Content
        </h1>
      </section>

      <form
        onSubmit={handleSaveTopic}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <label className="text-sm font-medium text-slate-700">Category</label>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
        >
          {departments.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>

        <label className="mt-3 block text-sm font-medium text-slate-700">
          Subject
        </label>
        <select
          value={selectedSubjectName}
          onChange={(e) => setSelectedSubjectName(e.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
        >
          {subjectOptions.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Add topics for {selectedSubjectName}
            </h2>
            <p className="text-sm text-slate-500">
              Create multiple topics in one batch. Leave empty rows and they
              will be skipped.
            </p>
          </div>
          <button
            type="button"
            onClick={addTopicRow}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            + Add row
          </button>
        </div>

        {topics.map((topicItem, index) => (
          <div
            key={index}
            className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Topic {index + 1}
              </h3>
              {topics.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removeTopicRow(index)}
                  className="text-sm font-semibold text-rose-600 hover:text-rose-800"
                >
                  Remove
                </button>
              ) : null}
            </div>
            <input
              value={topicItem.title}
              onChange={(e) => updateTopic(index, "title", e.target.value)}
              placeholder="Topic title"
              className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
            <input
              value={topicItem.description}
              onChange={(e) =>
                updateTopic(index, "description", e.target.value)
              }
              placeholder="Short description (optional)"
              className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
            <textarea
              value={topicItem.content}
              onChange={(e) => updateTopic(index, "content", e.target.value)}
              placeholder="Content / Notes"
              rows={5}
              className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
            <input
              value={topicItem.imageUrl}
              onChange={(e) => updateTopic(index, "imageUrl", e.target.value)}
              placeholder="Image URL (optional)"
              className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </div>
        ))}

        <button
          disabled={saving}
          className="mt-4 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
        >
          {saving ? "Saving..." : "Save Topics"}
        </button>
      </form>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Upload Notes CSV
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          CSV columns: title,description,content,imageUrl
        </p>
        <input
          type="file"
          accept=".csv"
          onChange={handleCsvUpload}
          className="mt-3 block w-full text-sm"
        />
      </section>
    </div>
  );
}
