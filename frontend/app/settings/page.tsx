"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import { useAuth } from "@/hooks/useAuth";
import LoadingScreen from "@/components/LoadingScreen";

const subjectOptions = [
  "Mathematics",
  "English",
  "Physics",
  "Chemistry",
  "Biology",
  "Government",
  "Economics",
];

type ToggleRowProps = {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

function ToggleRow({ label, hint, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="text-4xl leading-none"
        aria-pressed={checked}
        aria-label={`${label} ${checked ? "enabled" : "disabled"}`}
      >
        {checked ? (
          <BsToggleOn className="text-emerald-600 transition-colors" />
        ) : (
          <BsToggleOff className="text-slate-400 transition-colors" />
        )}
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
    examReminders: true,
    assignmentReminders: true,
    dailyStudyReminders: true,
    aiTutorNotifications: true,
  });

  const [study, setStudy] = useState({
    language: "English",
    preferredExamMode: "WAEC",
    aiDifficultyLevel: "Medium",
    dailyStudyTarget: 90,
    studyTimerMinutes: 45,
    preferredSubjects: ["Mathematics", "English"],
  });

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user, router]);

  const completion = useMemo(() => {
    let done = 0;
    if (study.language) done += 1;
    if (study.preferredExamMode) done += 1;
    if (study.aiDifficultyLevel) done += 1;
    if (study.dailyStudyTarget > 0) done += 1;
    if (study.studyTimerMinutes > 0) done += 1;
    if (study.preferredSubjects.length > 0) done += 1;
    return `${done}/6 configured`;
  }, [study]);

  if (loading || !user) {
    return <LoadingScreen message="Loading settings..." />;
  }

  const toggleSubject = (name: string) => {
    setStudy((prev) => {
      const exists = prev.preferredSubjects.includes(name);
      return {
        ...prev,
        preferredSubjects: exists
          ? prev.preferredSubjects.filter((item) => item !== name)
          : [...prev.preferredSubjects, name],
      };
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-md">
        <p className="text-sm text-emerald-200">Preferences</p>
        <h1 className="mt-1 text-2xl font-bold md:text-3xl">Settings</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-200">
          Manage account security, notifications, and your personal study setup
          in one place.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Authentication & Security
            </h2>
            <p className="text-sm text-slate-500">
              Password, sign-in options, and account protection controls.
            </p>
          </div>
          <Link
            href="/settings/security"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
          >
            Open Security Center
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Notification Settings
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Choose which updates and reminders you want to receive.
        </p>
        <div className="mt-4 space-y-3">
          <ToggleRow
            label="Push notifications"
            checked={notifications.push}
            onChange={(value) =>
              setNotifications((prev) => ({ ...prev, push: value }))
            }
          />
          <ToggleRow
            label="Email notifications"
            checked={notifications.email}
            onChange={(value) =>
              setNotifications((prev) => ({ ...prev, email: value }))
            }
          />
          <ToggleRow
            label="SMS alerts"
            checked={notifications.sms}
            onChange={(value) =>
              setNotifications((prev) => ({ ...prev, sms: value }))
            }
          />
          <ToggleRow
            label="Exam reminders"
            checked={notifications.examReminders}
            onChange={(value) =>
              setNotifications((prev) => ({ ...prev, examReminders: value }))
            }
          />
          <ToggleRow
            label="Assignment reminders"
            checked={notifications.assignmentReminders}
            onChange={(value) =>
              setNotifications((prev) => ({
                ...prev,
                assignmentReminders: value,
              }))
            }
          />
          <ToggleRow
            label="Daily study reminders"
            checked={notifications.dailyStudyReminders}
            onChange={(value) =>
              setNotifications((prev) => ({
                ...prev,
                dailyStudyReminders: value,
              }))
            }
          />
          <ToggleRow
            label="AI tutor notifications"
            checked={notifications.aiTutorNotifications}
            onChange={(value) =>
              setNotifications((prev) => ({
                ...prev,
                aiTutorNotifications: value,
              }))
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Study Preferences
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Personalize your study flow and exam preparation pattern.
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {completion}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium text-slate-700">
              Preferred exam mode
            </span>
            <select
              value={study.preferredExamMode}
              onChange={(e) =>
                setStudy((prev) => ({
                  ...prev,
                  preferredExamMode: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            >
              <option>WAEC</option>
              <option>JAMB</option>
              <option>Both</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-slate-700">
              AI difficulty level
            </span>
            <select
              value={study.aiDifficultyLevel}
              onChange={(e) =>
                setStudy((prev) => ({
                  ...prev,
                  aiDifficultyLevel: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
              <option>Adaptive</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-slate-700">Language</span>
            <select
              value={study.language}
              onChange={(e) =>
                setStudy((prev) => ({ ...prev, language: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            >
              <option>English</option>
              <option>French</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-slate-700">
              Daily study target (minutes)
            </span>
            <input
              type="number"
              min={15}
              max={720}
              value={study.dailyStudyTarget}
              onChange={(e) =>
                setStudy((prev) => ({
                  ...prev,
                  dailyStudyTarget: Number(e.target.value || 0),
                }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
          </label>

          <label className="space-y-1 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">
              Study timer (minutes per session)
            </span>
            <input
              type="range"
              min={15}
              max={120}
              step={5}
              value={study.studyTimerMinutes}
              onChange={(e) =>
                setStudy((prev) => ({
                  ...prev,
                  studyTimerMinutes: Number(e.target.value),
                }))
              }
              className="w-full"
            />
            <p className="text-xs text-slate-500">
              Current timer: {study.studyTimerMinutes} minutes
            </p>
          </label>
        </div>

        <div className="mt-5">
          <p className="text-sm font-medium text-slate-700">
            Preferred subjects
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {subjectOptions.map((subject) => {
              const active = study.preferredSubjects.includes(subject);
              return (
                <button
                  key={subject}
                  type="button"
                  onClick={() => toggleSubject(subject)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-500"
                  }`}
                >
                  {subject}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
