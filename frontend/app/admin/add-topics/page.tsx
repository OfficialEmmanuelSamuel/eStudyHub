"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAdminAuth } from "@/context/AdminAuthProvider";
import { allProvidedSubjects, departmentSubjects } from "@/lib/subjectCatalog";
import { API_BASE } from "@/lib/apiBase";

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
      <section className="rounded-[2rem] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-xl shadow-slate-950/20">
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">
          Admin Portal
        </p>
        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold">Add Topics and Content</h1>
            <p className="max-w-2xl text-sm text-slate-300">
              Create and manage topics quickly using a modern form + CSV upload.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 px-4 py-3 text-slate-100">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
              Current subject
            </p>
            <p className="mt-2 text-lg font-semibold">{selectedSubjectName}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <form
          onSubmit={handleSaveTopic}
          className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
        >
          <div className="p-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Category
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm"
                >
                  {departments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Subject
                </label>
                <select
                  value={selectedSubjectName}
                  onChange={(e) => setSelectedSubjectName(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm"
                >
                  {subjectOptions.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Topic selection
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Pick the subject topic for this batch or leave it
                  subject-wide.
                </p>
              </div>
              <select
                value={selectedSubjectName}
                onChange={(e) => setSelectedSubjectName(e.target.value)}
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm"
              >
                {subjectOptions.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Add topics for {selectedSubjectName}
                  </p>
                  <p className="text-sm text-slate-500">
                    Create multiple topics in one batch. Empty rows will be
                    ignored.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addTopicRow}
                  className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  + Add row
                </button>
              </div>
            </div>

            {topics.map((topicItem, index) => (
              <div
                key={index}
                className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Topic {index + 1}
                    </p>
                    <p className="text-xs text-slate-500">
                      Add title, description, notes, and optional image link.
                    </p>
                  </div>
                  {topics.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeTopicRow(index)}
                      className="rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-700 hover:bg-rose-200"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>

                <div className="mt-4 space-y-4">
                  <input
                    value={topicItem.title}
                    onChange={(e) =>
                      updateTopic(index, "title", e.target.value)
                    }
                    placeholder="Topic title"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm"
                  />
                  <input
                    value={topicItem.description}
                    onChange={(e) =>
                      updateTopic(index, "description", e.target.value)
                    }
                    placeholder="Short description (optional)"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm"
                  />
                  <textarea
                    value={topicItem.content}
                    onChange={(e) =>
                      updateTopic(index, "content", e.target.value)
                    }
                    placeholder="Content / Notes"
                    rows={4}
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm"
                  />
                  <input
                    value={topicItem.imageUrl}
                    onChange={(e) =>
                      updateTopic(index, "imageUrl", e.target.value)
                    }
                    placeholder="Image URL (optional)"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm"
                  />
                </div>
              </div>
            ))}

            <button
              disabled={saving}
              className="mt-5 inline-flex w-full items-center justify-center rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving topics…" : "Save topics"}
            </button>
          </div>
        </form>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-xl">
            <h2 className="text-lg font-semibold">Upload Notes CSV</h2>
            <p className="mt-3 text-sm text-slate-300">
              Use the CSV uploader to create topics in bulk with the columns
              below.
            </p>
            <div className="mt-4 rounded-3xl bg-slate-900 p-4 text-sm text-slate-300">
              title,description,content,imageUrl
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Quick tips</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>• Keep topic titles concise and easy to scan.</li>
              <li>• Add descriptions to support quick review.</li>
              <li>• Use image URLs only when relevant to the content.</li>
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
