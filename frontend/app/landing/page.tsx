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
    <div className="min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="mx-auto px-3 lg:max-w-6xl">
        <motion.header
          {...fadeUp}
          className="flex items-center justify-between py-6"
        >
          <div className="text-2xl font-bold tracking-tight">eStudy Hub</div>

          <Link
            href="/auth/register"
            className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-cyan-300"
          >
            Get Started
          </Link>
        </motion.header>

        <motion.section
          {...fadeUp}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 px-5 py-5 md:px-14"
        >
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="relative grid gap-5 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-4 inline-block rounded-full border border-cyan-300/40 bg-cyan-300/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                AI Learning Platform
              </p>
              <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
                Learn Faster With an AI Tutor Built for Serious Students
              </h1>
              <p className="mt-5 max-w-xl text-slate-300">
                eStudy Hub combines adaptive learning, instant explanations, and
                intelligent quizzes so you can master topics with confidence.
              </p>
              <div className="mt-8 flex flex-row gap-3">
                <StartLearningButton className="rounded-xl bg-cyan-400 px-6 py-3 text-center text-sm font-semibold text-slate-900 hover:bg-cyan-300">
                  Start Learning
                </StartLearningButton>
                <Link
                  href="/dashboard"
                  className="rounded-xl border border-white/20 px-6 py-3 text-center text-sm text-white hover:bg-white/10"
                >
                  My Dashboard
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-2xl font-bold text-cyan-300">25k+</p>
                  <p className="text-slate-400">Active Students</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-cyan-300">1.2M+</p>
                  <p className="text-slate-400">Questions Solved</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-cyan-300">4.9/5</p>
                  <p className="text-slate-400">Average Rating</p>
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
                  className="h-auto w-full rounded-2xl object-cover shadow-2xl shadow-cyan-900/35"
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
                  className="h-auto w-full rounded-2xl object-cover shadow-2xl shadow-cyan-950/35"
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section id="features" className="py-8 px-3" {...fadeUp}>
          <h2 className="text-3xl text-center font-bold">
            Everything You Need to Study Smarter
          </h2>
          <p className="mt-5 px-5 text-center text-slate-300">
            Built for learners who want structure, speed, and clarity.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.1, duration: 0.45 }}
                className="rounded-2xl bg-gradient-to-br from-slate-400/50 to-cyan-500/5 backdrop-blur-sm p-6 shadow-sm shadow-white/20"
              >
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-300">
                  {feature.description}
                </p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section className="pb-14 overflow-x-hidden" {...fadeUp}>
          <div className="grid px-3 gap-4 md:grid-cols-2">
            {valueCards.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: idx * 0.07, duration: 0.4 }}
                  className={`rounded-2xl p-6 text-slate-800 ${item.tone}`}
                >
                  <h3 className="flex items-center gap-4 text-lg text-white font-bold">
                    <Icon className="text-lg text-white" />
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-white">
                    {item.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </motion.section>

        <motion.section className="pb-10 overflow-x-hidden" {...fadeUp}>
          <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6 md:p-10">
            <h2 className="text-center text-2xl font-bold text-white md:text-5xl">
              Comprehensive Curriculum Coverage
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {curriculumCards.map((item, idx) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: idx * 0.07, duration: 0.4 }}
                  className={`rounded border-l-2 ${item.accent} bg-white/10 p-5 backdrop-blur-sm`}
                >
                  <p className="inline-flex items-center gap-2 text-base font-semibold text-orange-300">
                    <FaCheckCircle />
                    Standard
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-slate-200">{item.description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section className="pb-10" {...fadeUp}>
          <div className="rounded-3xl bg-slate-100 py-8 px-3 text-center text-slate-800 md:p-12">
            <FaRocket className="mx-auto text-4xl text-orange-500" />
            <h2 className="mt-4 text-4xl font-bold">Why Choose eStudy Hub?</h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-600">
              The smarter way to learn, blending textbooks, technology, and
              teaching into one powerful platform. eStudy Hub helps children
              master core subjects with confidence and joy, while givingn
              parents, teachers, and schools practical tools to guide learning
              outcomes.
            </p>
            <div className="mt-10 px-3 grid gap-4 md:grid-cols-3">
              <article className="rounded border-r-2 border-orange-400 bg-white p-6">
                <FaChartLine className="mx-auto text-2xl text-orange-500" />
                <h3 className="mt-3 text-lg font-semibold">
                  Elevate Learning Outcomes
                </h3>
                <p className="mt-2 text-slate-600">
                  Helps students master core subjects with interactive and
                  engaging content.
                </p>
              </article>
              <article className="rounded border-l-2 border-cyan-400 bg-white p-6">
                <FaMoneyBillWave className="mx-auto text-2xl text-cyan-500" />
                <h3 className="mt-3 text-lg font-semibold">
                  Affordable & Scalable
                </h3>
                <p className="mt-2 text-slate-600">
                  A cost-effective solution for homes and schools, replacing
                  multiple textbooks.
                </p>
              </article>
              <article className="rounded border-r-2 border-amber-400 bg-white p-6">
                <FaMapMarkerAlt className="mx-auto text-2xl text-amber-500" />
                <h3 className="mt-3 text-lg font-semibold">
                  Built for Africa, by Nigerians
                </h3>
                <p className="mt-2 text-slate-600">
                  Designed locally to meet the real needs of learners, teachers,
                  and parents.
                </p>
              </article>
            </div>
          </div>
        </motion.section>

        <motion.section id="subjects" className="pb-16" {...fadeUp}>
          <h2 className="text-2xl text-center font-bold">Popular Subjects</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
            {subjects.map((subject, index) => {
              const Icon = subject.icon;
              return (
                <motion.div
                  key={subject.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ delay: index * 0.07, duration: 0.35 }}
                  className="rounded-xl shadow-sm shadow-white/20 bg-white/10 backdrop-blur-sm p-5 text-center font-medium text-slate-200"
                >
                  <Icon className="mx-auto mb-3 text-xl text-cyan-300" />
                  {subject.name}
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        <motion.section id="reviews" className="pb-16" {...fadeUp}>
          <h2 className="text-2xl font-bold text-center">What Students Say</h2>
          <TestimonialsSwiper testimonials={testimonials} />
        </motion.section>

        <motion.section className="pb-20" {...fadeUp}>
          <div className="rounded-3xl shadow-sm shadow-cyan-300/20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-8 text-center md:p-12">
            <h2 className="text-3xl font-bold md:text-4xl">
              Ready to Upgrade Your Learning?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-200">
              Join eStudy Hub and turn scattered reading into focused progress.
            </p>
            <StartLearningButton className="mt-7 inline-block rounded-xl bg-cyan-400 px-7 py-3 font-semibold text-slate-900 hover:bg-cyan-300">
              Get Started
            </StartLearningButton>
          </div>
        </motion.section>
        <LandingFooter />
      </div>
    </div>
  );
}

