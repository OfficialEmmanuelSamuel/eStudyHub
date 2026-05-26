"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRightLong, FaClipboardCheck } from "react-icons/fa6";

const options = [
  {
    title: "General Quiz",
    subtitle: "WAEC and JAMB exam mode",
    description:
      "Take exam-style quizzes under general mode with fast feedback and performance tracking.",
    href: "/quiz/general",
    image: "/eStudyHub (1).jpg",
    badge: "General",
  },
  {
    title: "Subject Quiz",
    subtitle: "Pick category and subject",
    description:
      "Choose a category, select a subject, and start focused quizzes for deeper subject mastery.",
    href: "/quiz/subject",
    image: "/eStudyHub (2).jpg",
    badge: "Subject Based",
  },
];

export default function QuizHomePage() {
  return (
    <main className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-7 text-white shadow-lg">
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-52 w-52 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="relative">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-200">
            <FaClipboardCheck />
            Smart Quiz Arena
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
            Choose Quiz Type
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-200 md:text-base">
            Start with General Quiz or go straight into Subject Quiz by
            category.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {options.map((item, idx) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: idx * 0.08 }}
            className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative h-52 w-full overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 1280px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority={idx === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-slate-900">
                {item.badge}
              </span>
            </div>

            <div className="space-y-3 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                {item.subtitle}
              </p>
              <h2 className="text-xl font-bold text-slate-900">{item.title}</h2>
              <p className="text-sm leading-6 text-slate-600">
                {item.description}
              </p>
              <Link
                href={item.href}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
              >
                Open {item.title}
                <FaArrowRightLong />
              </Link>
            </div>
          </motion.article>
        ))}
      </section>
    </main>
  );
}
