"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FaBookOpen, FaLayerGroup } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE } from "@/lib/apiBase";
import LoadingScreen from "@/components/LoadingScreen";

type Subject = {
  id: string;
  name: string;
  department: string;
  description?: string | null;
  _count?: {
    topics: number;
    quizzes: number;
  };
};

type Topic = {
  id: string;
  title: string;
  description?: string | null;
  _count?: {
    quizzes: number;
  };
};

export default function SubjectsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [activeDepartment, setActiveDepartment] = useState<string>("");
  const [activeSubjectId, setActiveSubjectId] = useState<string>("");
  const [savingSubject, setSavingSubject] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const loadSubjects = async () => {
      setLoadingSubjects(true);
      try {
        const res = await fetch(`${API_BASE}/api/catalog/subjects`);
        if (!res.ok) throw new Error("failed");
        const data = (await res.json()) as Subject[];
        setSubjects(data);
        if (data.length > 0) {
          setActiveDepartment(data[0].department);
          setActiveSubjectId(data[0].id);
        }
      } catch {
        toast.error("Could not fetch subjects from database.");
      } finally {
        setLoadingSubjects(false);
      }
    };
    loadSubjects();
  }, []);

  const departments = useMemo(
    () => Array.from(new Set(subjects.map((item) => item.department))),
    [subjects],
  );

  const departmentSubjects = useMemo(
    () => subjects.filter((item) => item.department === activeDepartment),
    [subjects, activeDepartment],
  );

  useEffect(() => {
    const loadTopics = async () => {
      if (!activeSubjectId) {
        setTopics([]);
        return;
      }
      setLoadingTopics(true);
      try {
        const res = await fetch(
          `${API_BASE}/api/catalog/subjects/${activeSubjectId}/topics`,
        );
        if (!res.ok) throw new Error("failed");
        const data = (await res.json()) as Topic[];
        setTopics(data);
      } catch {
        toast.error("Could not fetch topics.");
      } finally {
        setLoadingTopics(false);
      }
    };
    loadTopics();
  }, [activeSubjectId]);

  const activeSubject = useMemo(
    () => departmentSubjects.find((item) => item.id === activeSubjectId),
    [departmentSubjects, activeSubjectId],
  );

  const handleStudy = async (subject: Subject) => {
    if (!user) return;
    setSavingSubject(subject.id);
    try {
      const response = await fetch(`${API_BASE}/api/subjects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: user.uid,
          department: subject.department,
          category: "Database Subject",
          name: subject.name,
        }),
      });
      if (!response.ok) throw new Error("save failed");
      toast.success(`${subject.name} added to My Subjects`);
    } catch {
      toast.error("Could not add subject.");
    } finally {
      setSavingSubject(null);
    }
  };

  if (loading || !user || loadingSubjects) {
    return <LoadingScreen message="Loading subjects..." />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-md">
        <p className="text-sm text-emerald-200">Database Subjects</p>
        <h1 className="mt-1 text-2xl font-bold md:text-3xl">
          Choose Category and Subject
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-200">
          Students now fetch subjects and topics directly from database.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {departments.map((department) => (
          <button
            key={department}
            type="button"
            onClick={() => {
              setActiveDepartment(department);
              const selected = subjects.find(
                (item) => item.department === department,
              );
              setActiveSubjectId(selected?.id || "");
            }}
            className={`rounded-xl border px-4 py-4 text-left transition ${
              department === activeDepartment
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
            }`}
          >
            <p className="text-base font-semibold">{department}</p>
            <p
              className={`mt-1 text-xs ${department === activeDepartment ? "text-slate-200" : "text-slate-500"}`}
            >
              Click to view subjects
            </p>
          </button>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Subjects</h2>
          <div className="mt-4 space-y-3">
            {departmentSubjects.map((subject) => (
              <div
                key={subject.id}
                onClick={() => setActiveSubjectId(subject.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveSubjectId(subject.id);
                  }
                }}
                role="button"
                tabIndex={0}
                className={`w-full rounded-xl border p-4 text-left ${
                  activeSubjectId === subject.id
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{subject.name}</p>
                    <p
                      className={`mt-1 text-xs ${activeSubjectId === subject.id ? "text-slate-200" : "text-slate-500"}`}
                    >
                      Topics: {subject._count?.topics || 0} | Quizzes:{" "}
                      {subject._count?.quizzes || 0}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleStudy(subject);
                    }}
                    disabled={savingSubject === subject.id}
                    className="rounded-md bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-cyan-300 disabled:opacity-60"
                  >
                    {savingSubject === subject.id ? "Adding..." : "Study"}
                  </button>
                </div>
              </div>
            ))}
            {departmentSubjects.length === 0 ? (
              <p className="text-sm text-slate-500">
                No subjects in this category.
              </p>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <FaLayerGroup className="text-emerald-600" />
            {activeSubject?.name || "Topics"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {activeSubject?.description || "Subject topics from database."}
          </p>
          <div className="mt-4 space-y-3">
            {loadingTopics ? (
              <p className="text-sm text-slate-500">Loading topics...</p>
            ) : null}
            {!loadingTopics && topics.length === 0 ? (
              <p className="text-sm text-slate-500">No topics uploaded yet.</p>
            ) : null}
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <FaBookOpen className="text-emerald-600" />
                  {topic.title}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {topic.description || "No description"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Quiz items: {topic._count?.quizzes || 0}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
