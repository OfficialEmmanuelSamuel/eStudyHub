"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaBook,
  FaCalculator,
  FaChartLine,
  FaCheckCircle,
  FaCode,
  FaDna,
  FaFlask,
  FaLanguage,
  FaMobileAlt,
  FaMoneyBillWave,
  FaRocket,
  FaWifi,
  FaGraduationCap,
  FaMapMarkerAlt,
} from "react-icons/fa";
import TestimonialsSwiper from "@/components/TestimonialsSwiper";
import StartLearningButton from "@/components/StartLearningButton";
import LandingFooter from "@/components/LandingFooter";

const features = [
  {
    title: "Adaptive Study Paths",
    description:
      "AI maps your strengths and gaps, then builds a weekly plan that updates after every session.",
  },
  {
    title: "Instant Tutor Help",
    description:
      "Ask questions in plain language and get clear, step-by-step explanations anytime.",
  },
  {
    title: "Smart Progress Tracking",
    description:
      "See what is improving, what is slipping, and where to focus next with actionable insights.",
  },
];

const subjects = [
  { name: "Mathematics", icon: FaCalculator },
  { name: "Physics", icon: FaBook },
  { name: "Chemistry", icon: FaFlask },
  { name: "Biology", icon: FaDna },
  { name: "English", icon: FaLanguage },
  { name: "Coding", icon: FaCode },
];

const testimonials = [
  {
    name: "Damilola A.",
    role: "WAEC Candidate",
    quote:
      "I moved from random reading to a real study system. The AI tutor feels like a personal coach.",
  },
  {
    name: "Ifeanyi O.",
    role: "Undergraduate",
    quote:
      "The quizzes are sharp and the feedback is immediate. My consistency has improved a lot.",
  },
  {
    name: "Ruth E.",
    role: "JAMB Candidate",
    quote:
      "My study sessions are now focused and measurable. I finally know what to revise every day.",
  },
];

const valueCards = [
  {
    title: "Offline Learning",
    description:
      "Learn without internet connectivity, perfect for any environment.",
    icon: FaWifi,
    tone: "bg-gradient-to-bl from-orange-100 to-orange-500/5",
  },
  {
    title: "Massive Subject Coverage",
    description:
      "15-30 subjects per class, from SS1 through SS3, including religion.",
    icon: FaBook,
    tone: "bg-gradient-to-bl from-cyan-500/50 to-cyan-500/5 ",
  },
  {
    title: "Cross-Device Support",
    description:
      "Works seamlessly on mobile phones, tablets, laptops, and desktops.",
    icon: FaMobileAlt,
    tone: "bg-gradient-to-bl from-amber-500/50 to-amber-500/5",
  },
  {
    title: "Wide Curriculum Alignment",
    description:
      "Covers NERDC, Lagos Unified Scheme, NAPPS, and Federal curriculum.",
    icon: FaGraduationCap,
    tone: "bg-gradient-to-bl from-indigo-500/50 to-indigo-500/5",
  },
  {
    title: "Performance Dashboard",
    description:
      "See progress and performance across different subjects in real time.",
    icon: FaChartLine,
    tone: "bg-gradient-to-bl from-fuchsia-500/50 to-fuchsia-500/5",
  },
];

const curriculumCards = [
  {
    title: "Nigerian National Curriculum (NERDC)",
    description:
      "Full alignment with the Nigerian Educational Research and Development Council standards.",
    accent: "border-orange-400",
  },
  {
    title: "Lagos State Unified Scheme",
    description:
      "Comprehensive coverage of the Lagos State Unified Scheme of Work.",
    accent: "border-cyan-400",
  },
  {
    title: "NAPPS Curriculum",
    description:
      "Aligned with the National Association of Proprietors of Private Schools standards.",
    accent: "border-amber-400",
  },
  {
    title: "Federal Curriculum",
    description:
      "Complete coverage of the Federal Ministry of Education curriculum.",
    accent: "border-blue-500",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.55, ease: "easeOut" as const },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-950">
      <div className="mx-auto px-3 lg:max-w-6xl">
        <motion.header
          {...fadeUp}
          className="flex items-center justify-between py-6"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-3 w-40 lg:w-150"
          >
            <Image
              src="/eStudy.png"
              alt="eStudy Hub"
              width={150}
              height={40}
              className="h-10 w-auto object-contain"
            />
          </Link>

          <Link
            href="/auth/register"
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-emerald-200 shadow-sm shadow-cyan-200/40 transition hover:bg-slate-400"
          >
            Get Started
          </Link>
        </motion.header>

        <motion.section
          {...fadeUp}
          className="relative overflow-hidden rounded-3xl bg-emerald-200/10 border border-slate-200 px-5 py-5 shadow-sm md:px-14"
        >
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl" />
          <div className="relative grid gap-5 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-4 inline-block rounded-full border border-slate-900 bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
                AI Learning Platform
              </p>
              <h1 className="text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
                Learn Faster With an AI Tutor Built for Serious Students
              </h1>
              <p className="mt-5 max-w-xl font-semibold text-slate-800">
                eStudy Hub combines adaptive learning, instant explanations, and
                intelligent quizzes so you can master topics with confidence.
              </p>
              <div className="mt-8 flex flex-row gap-3">
                <StartLearningButton className="rounded-xl bg-slate-900 px-6 py-3 text-center text-sm font-semibold text-emerald-200 shadow-sm shadow-cyan-200/40 transition hover:bg-slate-900">
                  Start Learning
                </StartLearningButton>
                <Link
                  href="/dashboard"
                  className="rounded-xl border border-emerald-700 bg-emerald-700 px-6 py-3 text-center text-sm text-white transition hover:bg-emerald-900"
                >
                  My Dashboard
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-2xl font-bold text-slate-600">25k+</p>
                  <p className="text-slate-500">Active Students</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-600">1.2M+</p>
                  <p className="text-slate-500">Questions Solved</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-600">4.9/5</p>
                  <p className="text-slate-500">Average Rating</p>
                </div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative mx-auto h-[390px] w-full max-w-[640px] bg-transparent sm:h-[420px] sm:max-w-[700px] md:h-[360px] md:max-w-[760px] lg:h-[430px] lg:max-w-[940px]"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-0 top-1/2 z-10 hidden w-[60%] -translate-y-1/2 md:block md:w-[58%]"
              >
                <Image
                  src="/hero (1).png"
                  alt="Student learning with AI tutor"
                  width={700}
                  height={460}
                  className="h-auto w-full rounded-2xl object-cover shadow-2xl shadow-emerald-900/35"
                  priority
                />
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 md:left-auto md:right-0 md:w-[58%] md:translate-x-0"
              >
                <Image
                  src="/hero (2).png"
                  alt="Progress dashboard preview"
                  width={700}
                  height={460}
                  className="h-auto w-full rounded-2xl object-cover shadow-2xl shadow-emerald-950/35"
                  priority
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section id="features" className="py-6 px-3" {...fadeUp}>
          <div className="mx-auto max-w-5xl space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-3xl shadow-sm shadow-slate-200 bg-gradient-to-br from-slate-900 to-slate-900 shadow-sm shadow-white/10 p-6 text-white"
                >
                  <h2 className="text-lg font-semibold text-white">
                    {feature.title}
                  </h2>
                  <p className="mt-2 text-sm text-white">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section className="space-y-10 py-8 px-3" {...fadeUp}>
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.16em] font-semibold text-emerald-600">
                Subjects covered
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">
                Learn what matters most.
              </h2>
            </div>
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"></div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject) => {
                const Icon = subject.icon;
                return (
                  <article
                    key={subject.name}
                    className="rounded-3xl shadow-sm shadow-slate-300 bg-white p-6 text-slate-950"
                  >
                    <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-emerald-600">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-xl font-semibold">{subject.name}</h3>
                    <p className="mt-2 font-medium text-sm text-slate-600">
                      Practical lessons, quizzes, and examples to build real
                      exam confidence.
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </motion.section>

        <motion.section className="space-y-8 py-8 px-3" {...fadeUp}>
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <p className="text-sm uppercase tracking-[0.16em] font-semibold text-emerald-600">
                Why students choose us
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">
                Built for better learning habits.
              </h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {valueCards.map((card) => {
                const Icon = card.icon;
                return (
                  <article
                    key={card.title}
                    className={`rounded-3xl shadow-sm shadow-slate-200 bg-white p-6 shadow-sm ${card.tone}`}
                  >
                    <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-950">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-slate-600">
                      {card.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </motion.section>

        <motion.section className="space-y-8 py-8 px-3" {...fadeUp}>
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <p className="text-sm uppercase tracking-[0.16em] font-semibold text-emerald-600">
                Our curriculum
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">
                Content mapped to the curriculum you need.
              </h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {curriculumCards.map((card) => (
                <article
                  key={card.title}
                  className={`rounded-3xl shadow-sm shadow-slate-300 bg-white p-6 text-slate-950 shadow-sm ${card.accent}`}
                >
                  <h3 className="text-xl font-semibold">{card.title}</h3>
                  <p className="mt-3 text-sm font-medium text-slate-600">
                    {card.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section className="space-y-8 py-8 px-3" {...fadeUp}>
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <p className="text-sm uppercase tracking-[0.16em] font-semibold text-emerald-600">
                Reviews from students
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">
                Real feedback from real students.
              </h2>
            </div>
            <TestimonialsSwiper testimonials={testimonials} />
          </div>
        </motion.section>

        <LandingFooter />
      </div>
    </div>
  );
}
