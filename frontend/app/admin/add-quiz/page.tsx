"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAdminAuth } from "@/context/AdminAuthProvider";
import { allProvidedSubjects, departmentSubjects } from "@/lib/subjectCatalog";
import { API_BASE } from "@/lib/apiBase";

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
      <section className="rounded-[2rem] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-xl shadow-slate-950/20">
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">
          Admin Portal
        </p>
        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold">Add Quiz</h1>
            <p className="max-w-2xl text-sm text-slate-300">
              Create quiz items with answer keys, explanations, and optional
              topic assignment.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 px-4 py-3 text-slate-100">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
              Subject
            </p>
            <p className="mt-2 text-lg font-semibold">{selectedSubjectName}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <form
          onSubmit={handleSaveQuiz}
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

            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Topic assignment
                  </p>
                  <p className="text-sm text-slate-500">
                    Assign this quiz to a topic or leave it subject-wide.
                  </p>
                </div>
                <select
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm"
                >
                  <option value="">General Subject Quiz</option>
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Question"
                rows={3}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  placeholder="Option A"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm"
                />
                <input
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  placeholder="Option B"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm"
                />
                <input
                  value={optionC}
                  onChange={(e) => setOptionC(e.target.value)}
                  placeholder="Option C"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm"
                />
                <input
                  value={optionD}
                  onChange={(e) => setOptionD(e.target.value)}
                  placeholder="Option D"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <select
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm"
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
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm"
                />
              </div>
            </div>

            <button
              disabled={saving}
              className="inline-flex w-full items-center justify-center rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving quiz…" : "Save quiz"}
            </button>
          </div>
        </form>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-xl">
            <h2 className="text-lg font-semibold">Quiz builder tips</h2>
            <p className="mt-3 text-sm text-slate-300">
              Use this form to create high-quality multiple choice questions
              with clear answers and optional explanations.
            </p>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>• Keep questions concise and unambiguous.</p>
              <p>
                • Provide explanations to help learners understand the correct
                answer.
              </p>
              <p>• Use the CSV upload for bulk quiz imports.</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Upload Quiz CSV
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              CSV columns:
              question,optionA,optionB,optionC,optionD,answer,explanation,topic
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="mt-4 block w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
