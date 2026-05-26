"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight, FaUsers } from "react-icons/fa6";

const groups = [
  { key: "WAEC", name: "West African Examinations Council", desc: "Exam drills, tips, and WAEC study updates.", members: "2.1k" },
  { key: "JAMB", name: "Joint Admissions and Matriculation Board", desc: "UTME practice community and strategy sessions.", members: "1.7k" },
  { key: "SCIENCE", name: "Science Enthusiasts", desc: "Physics, Chemistry, Biology problem solving.", members: "1.2k" },
  { key: "ART", name: "Art & Literature Club", desc: "Literature, CRS, Government, and Art support.", members: "860" },
  { key: "COMMERCIAL", name: "Commercial Studies Hub", desc: "Accounting, Commerce, Economics discussions.", members: "930" },
  { key: "GENERAL", name: "General Student Hub", desc: "General student hub and motivation room.", members: "3.4k" },
];

export default function LearningGroupPage() {
  return (
    <main className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-md"
      >
        <p className="text-sm text-cyan-200">Community Space</p>
        <h1 className="mt-1 text-2xl font-bold md:text-3xl">Student Learning Groups</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-200">
          Join your preferred group and chat with other students instantly.
        </p>
      </motion.section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group, idx) => (
          <motion.article
            key={group.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="text-xs font-semibold text-cyan-100 bg-slate-900 px-2 py-1 rounded-full w-25 text-center">
              {group.key}
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">{group.name} Community</h2>
            <p className="mt-2 text-sm text-slate-600">{group.desc}</p>
            <p className="mt-3 inline-flex items-center gap-2 mx-5 rounded-lg bg-slate-300 px-3 py-1 text-xs font-semibold text-slate-600">
              <FaUsers /> {group.members} Students
            </p>
            <Link
              href={`/learning-group/chat?group=${group.key}`}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-900 px-4 py-1 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Join Group
              <FaArrowRight className="text-xs" />
            </Link>
          </motion.article>
        ))}
      </section>
    </main>
  );
}
