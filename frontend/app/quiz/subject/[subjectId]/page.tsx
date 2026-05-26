"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { API_BASE } from "@/lib/apiBase";

type QuizItem = {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
  explanation?: string | null;
  topic?: {
    id: string;
    title: string;
  } | null;
};

export default function SubjectQuizRunPage() {
  const params = useParams<{ subjectId: string }>();
  const query = useSearchParams();
  const subjectName = query.get("name") || "Selected Subject";
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuizzes = async () => {
      if (!params.subjectId) return;
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/api/catalog/subjects/${params.subjectId}/quizzes`,
        );
        if (!res.ok) throw new Error("failed");
        const data = (await res.json()) as QuizItem[];
        setQuizzes(data);
      } catch {
        toast.error("Could not load quizzes for this subject.");
      } finally {
        setLoading(false);
      }
    };
    loadQuizzes();
  }, [params.subjectId]);

  return (
    <main className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-md">
        <p className="text-sm text-emerald-200">Quiz Session</p>
        <h1 className="mt-1 text-2xl font-bold md:text-3xl">{subjectName}</h1>
        <p className="mt-2 text-sm text-slate-200">Subject ID: {params.subjectId}</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {loading ? (
          <p className="text-sm text-slate-500">Loading quizzes...</p>
        ) : null}
        {!loading && quizzes.length === 0 ? (
          <p className="text-sm text-slate-600">
            No quizzes uploaded yet for{" "}
            <span className="font-semibold text-slate-900">{subjectName}</span>
            .
          </p>
        ) : null}

        <div className="space-y-3">
          {quizzes.map((quiz, index) => (
            <article
              key={quiz.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="text-xs font-semibold text-emerald-700">
                Question {index + 1}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {quiz.question}
              </p>
              {quiz.topic?.title ? (
                <p className="mt-1 text-xs text-slate-500">
                  Topic: {quiz.topic.title}
                </p>
              ) : null}
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                <li>A. {quiz.optionA}</li>
                <li>B. {quiz.optionB}</li>
                <li>C. {quiz.optionC}</li>
                <li>D. {quiz.optionD}</li>
              </ul>
            </article>
          ))}
        </div>

        <Link
          href="/quiz/subject"
          className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Back to Subject Quiz
        </Link>
      </section>
    </main>
  );
}
