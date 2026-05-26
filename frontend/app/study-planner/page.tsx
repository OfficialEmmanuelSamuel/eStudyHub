"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaBolt, FaCalendarCheck, FaClock, FaPlus } from "react-icons/fa6";

type PlanItem = {
  id: number;
  subject: string;
  topic: string;
  date: string;
  duration: number;
  priority: "High" | "Medium" | "Low";
  done: boolean;
};

const priorities: Array<PlanItem["priority"]> = ["High", "Medium", "Low"];

const initialPlan: PlanItem[] = [
  { id: 1, subject: "Mathematics", topic: "Quadratic Equations", date: "2026-05-23", duration: 90, priority: "High", done: false },
  { id: 2, subject: "English", topic: "Comprehension Practice", date: "2026-05-24", duration: 60, priority: "Medium", done: false },
  { id: 3, subject: "Physics", topic: "Motion and Forces", date: "2026-05-24", duration: 75, priority: "Low", done: true },
];

export default function StudyPlannerPage() {
  const [plan, setPlan] = useState<PlanItem[]>(initialPlan);
  const [form, setForm] = useState({
    subject: "",
    topic: "",
    date: "",
    duration: 60,
    priority: "Medium" as PlanItem["priority"],
  });

  const stats = useMemo(() => {
    const total = plan.length;
    const done = plan.filter((item) => item.done).length;
    const pending = total - done;
    const studyMins = plan.reduce((sum, item) => sum + item.duration, 0);
    return { total, done, pending, studyMins };
  }, [plan]);

  const addTask = () => {
    if (!form.subject.trim() || !form.topic.trim() || !form.date) return;

    setPlan((prev) => [
      {
        id: Date.now(),
        subject: form.subject.trim(),
        topic: form.topic.trim(),
        date: form.date,
        duration: Number(form.duration) || 60,
        priority: form.priority,
        done: false,
      },
      ...prev,
    ]);

    setForm({ subject: "", topic: "", date: "", duration: 60, priority: "Medium" });
  };

  const toggleDone = (id: number) => {
    setPlan((prev) => prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  };

  return (
    <main className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-md"
      >
        <p className="text-sm text-emerald-200">Productive Learning</p>
        <h1 className="mt-1 text-2xl font-bold md:text-3xl">Study Planner</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-200">Plan your daily reading tasks, track completion, and keep your preparation consistent.</p>
      </motion.section>

      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          ["Tasks", stats.total, <FaCalendarCheck key="a" />],
          ["Completed", stats.done, <FaBolt key="b" />],
          ["Pending", stats.pending, <FaClock key="c" />],
          ["Minutes", stats.studyMins, <FaClock key="d" />],
        ].map(([label, value, icon], idx) => (
          <motion.article
            key={String(label)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between text-slate-500">
              <p className="text-xs">{label}</p>
              <span>{icon}</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{String(value)}</p>
          </motion.article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Add Study Task</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          <input
            value={form.subject}
            onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
            placeholder="Subject"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
          <input
            value={form.topic}
            onChange={(e) => setForm((prev) => ({ ...prev, topic: e.target.value }))}
            placeholder="Topic"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
          <input
            type="number"
            min={15}
            max={240}
            value={form.duration}
            onChange={(e) => setForm((prev) => ({ ...prev, duration: Number(e.target.value || 60) }))}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
          <select
            value={form.priority}
            onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value as PlanItem["priority"] }))}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          >
            {priorities.map((priority) => (
              <option key={priority}>{priority}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={addTask}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          <FaPlus />
          Add Task
        </button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Task Board</h2>
        <div className="mt-4 space-y-3">
          {plan.map((item, idx) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.subject}: {item.topic}</p>
                <p className="text-xs text-slate-500">{item.date} | {item.duration} mins | {item.priority} priority</p>
              </div>
              <button
                type="button"
                onClick={() => toggleDone(item.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${item.done ? "bg-emerald-100 text-emerald-700" : "bg-slate-900 text-white"}`}
              >
                {item.done ? "Completed" : "Mark Done"}
              </button>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
