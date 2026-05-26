"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAdminAuth } from "@/context/AdminAuthProvider";
import { allProvidedSubjects, departmentSubjects } from "@/lib/subjectCatalog";
import { API_BASE } from "@/lib/apiBase";
import AdminNavbar from "@/components/AdminNavbar";

type Subject = { id: string; name: string; department: string };
type Topic = { id: string; title: string };

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

export default function AddQuizPage() {
  const router = useRouter();
  const { loading, isAdmin } = useAdminAuth();
  const [dbSubjects, setDbSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedDepartment, setSelectedDepartment] =
    useState<string>("Science Department");
  const [selectedSubjectName, setSelectedSubjectName] = useState(
    allProvidedSubjects[0],
  );
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [answer, setAnswer] = useState("A");
  const [explanation, setExplanation] = useState("");
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
    const fromDb = dbSubjects.map((subject) => subject.department).filter(Boolean);
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
      setSelectedTopicId("");
      setTopics([]);
      return;
    }
    if (!subjectOptions.includes(selectedSubjectName)) {
      setSelectedSubjectName(subjectOptions[0]);
      setSelectedTopicId("");
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

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const subjectId = await ensureSubjectId(selectedSubjectName);
        const res = await fetch(
          `${API_BASE}/api/catalog/subjects/${subjectId}/topics`,
        );
        if (!res.ok) throw new Error("failed");
        const data = (await res.json()) as Topic[];
        setTopics(data);
      } catch {
        setTopics([]);
      }
    };
    loadTopics();
  }, [selectedSubjectName]);

  const handleSaveQuiz = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const subjectId = await ensureSubjectId(selectedSubjectName);
      const answerMap: Record<string, string> = {
        A: optionA,
        B: optionB,
        C: optionC,
        D: optionD,
      };
      const res = await fetch(`${API_BASE}/api/admin/quizzes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subjectId,
          topicId: selectedTopicId || null,
          question,
          optionA,
          optionB,
          optionC,
          optionD,
          answer: answerMap[answer] || optionA,
          explanation,
        }),
      });
      if (!res.ok) throw new Error("failed");
      toast.success("Quiz saved");
      setQuestion("");
      setOptionA("");
      setOptionB("");
      setOptionC("");
      setOptionD("");
      setExplanation("");
      setAnswer("A");
    } catch {
      toast.error("Failed to save quiz");
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
      const topicByTitle = new Map(
        topics.map((topic) => [topic.title.toLowerCase(), topic.id]),
      );
      const payload = rows.map((row) => ({
        question: row.question,
        optionA: row.optionA,
        optionB: row.optionB,
        optionC: row.optionC,
        optionD: row.optionD,
        answer: row.answer,
        explanation: row.explanation,
        topicId: row.topic
          ? topicByTitle.get(row.topic.toLowerCase()) || null
          : null,
      }));
      const res = await fetch(`${API_BASE}/api/admin/quizzes/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subjectId, rows: payload }),
      });
      if (!res.ok) throw new Error("failed");
      toast.success("Quiz CSV uploaded");
    } catch {
      toast.error("Failed to upload quiz CSV");
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
        <h1 className="mt-1 text-2xl font-bold md:text-3xl">Add Quiz</h1>
      </section>

      <form
        onSubmit={handleSaveQuiz}
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

        <label className="mt-3 block text-sm font-medium text-slate-700">
          Topic (optional)
        </label>
        <select
          value={selectedTopicId}
          onChange={(e) => setSelectedTopicId(e.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
        >
          <option value="">General Subject Quiz</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.title}
            </option>
          ))}
        </select>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Question"
          rows={3}
          className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2"
        />
        <input
          value={optionA}
          onChange={(e) => setOptionA(e.target.value)}
          placeholder="Option A"
          className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2"
        />
        <input
          value={optionB}
          onChange={(e) => setOptionB(e.target.value)}
          placeholder="Option B"
          className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2"
        />
        <input
          value={optionC}
          onChange={(e) => setOptionC(e.target.value)}
          placeholder="Option C"
          className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2"
        />
        <input
          value={optionD}
          onChange={(e) => setOptionD(e.target.value)}
          placeholder="Option D"
          className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2"
        />
        <select
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2"
        >
          <option value="A">Answer: A</option>
          <option value="B">Answer: B</option>
          <option value="C">Answer: C</option>
          <option value="D">Answer: D</option>
        </select>
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Explanation (optional)"
          rows={4}
          className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2"
        />

        <button
          disabled={saving}
          className="mt-4 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
        >
          {saving ? "Saving..." : "Save Quiz"}
        </button>
      </form>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Upload Quiz CSV
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          CSV columns:
          question,optionA,optionB,optionC,optionD,answer,explanation,topic
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
