"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRightLong } from "react-icons/fa6";

const examModes = [
  {
    title: "WAEC Quiz",
    description: "Practice WAEC-style objective questions with timed flow.",
    href: "/quiz/waec",
  },
  {
    title: "JAMB Quiz",
    description: "Train with UTME-style questions and instant score feedback.",
    href: "/quiz/jamb",
  },
];

export default function GeneralQuizPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-md">
        <p className="text-sm text-emerald-200">General Mode</p>
        <h1 className="mt-1 text-2xl font-bold md:text-3xl">General Quiz</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-200">Choose WAEC or JAMB and begin exam-focused practice.</p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {examModes.map((item, idx) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            <Link
              href={item.href}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Start {item.title}
              <FaArrowRightLong />
            </Link>
          </motion.article>
        ))}
      </section>
    </main>
  );
}
