"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaArrowRightLong } from "react-icons/fa6";
import { API_BASE } from "@/lib/apiBase";

type Subject = {
  id: string;
  name: string;
  department: string;
  _count?: {
    quizzes: number;
  };
};

const categories = ["SCIENCE", "ART", "COMMERCIAL"] as const;

type Category = (typeof categories)[number];

function normalizeDepartment(value: string) {
  const normalized = value.trim().toUpperCase();
  if (normalized.includes("SCI")) return "SCIENCE";
  if (normalized.includes("ART")) return "ART";
  if (normalized.includes("COMM")) return "COMMERCIAL";
  return normalized;
}

export default function SubjectQuizPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>("SCIENCE");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/catalog/subjects`);
        if (!res.ok) throw new Error("failed");
        const data = (await res.json()) as Subject[];
        setSubjects(data);
      } catch {
        toast.error("Could not load subjects.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const filtered = useMemo(
    () => subjects.filter((item) => normalizeDepartment(item.department) === activeCategory),
    [subjects, activeCategory]
  );

  return (
    <main className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-md">
        <p className="text-sm text-emerald-200">Subject Mode</p>
        <h1 className="mt-1 text-2xl font-bold md:text-3xl">Subject Quiz</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-200">Pick a category to load all available subjects and start any subject quiz.</p>
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`rounded-xl border px-4 py-4 text-left transition ${
              category === activeCategory
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
            }`}
          >
            <p className="text-base font-semibold">{category}</p>
            <p className={`mt-1 text-xs ${category === activeCategory ? "text-slate-200" : "text-slate-500"}`}>
              View all subjects
            </p>
          </button>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{activeCategory} Subjects</h2>
        {loading ? <p className="mt-3 text-sm text-slate-500">Loading subjects...</p> : null}
        {!loading && filtered.length === 0 ? <p className="mt-3 text-sm text-slate-500">No subjects found in this category.</p> : null}

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {filtered.map((subject, idx) => (
            <motion.article
              key={subject.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="rounded-xl border border-slate-200 p-4"
            >
              <p className="text-sm font-semibold text-slate-900">{subject.name}</p>
              <p className="mt-1 text-xs text-slate-500">Quiz items: {subject._count?.quizzes || 0}</p>
              <Link
                href={`/quiz/subject/${subject.id}?name=${encodeURIComponent(subject.name)}`}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700"
              >
                Start Quiz
                <FaArrowRightLong />
              </Link>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
