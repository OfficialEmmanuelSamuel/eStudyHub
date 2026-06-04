"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaBolt,
  FaClock,
  FaFire,
  FaStar,
  FaBookOpen,
  FaExclamation,
  FaRobot,
  FaCoins,
  FaArrowUp,
  FaMedal,
  FaTrophy,
  FaTag,
  FaClipboardCheck,
} from "react-icons/fa6";
import { useAuth } from "@/hooks/useAuth";
import type { IconType } from "react-icons";
import LoadingScreen from "@/components/LoadingScreen";
import { API_BASE } from "@/lib/apiBase";
import {
  loadNotifications,
  type AppNotification,
} from "@/lib/notificationStorage";

type LeaderboardUser = {
  uid: string;
  email?: string;
  fullName?: string;
  xpPoints?: number;
  _xp: number;
  _name: string;
};

type Summary = {
  subjects: number;
  topics: number;
  quizzes: number;
};

type Overview = {
  continueLearning: string | null;
  stats: {
    quizzesTaken: number;
    avgScore: number;
    topicsDone: number;
    pendingTasks: number;
    aiAsked: number;
    xpPoints: number;
    level: number;
    streakDays: number;
  };
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45 },
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const [totalUsers, setTotalUsers] = useState(0);
  const [summary, setSummary] = useState<Summary>({
    subjects: 0,
    topics: 0,
    quizzes: 0,
  });
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [overview, setOverview] = useState<Overview>({
    continueLearning: null,
    stats: {
      quizzesTaken: 0,
      avgScore: 0,
      topicsDone: 0,
      pendingTasks: 0,
      aiAsked: 0,
      xpPoints: 0,
      level: 1,
      streakDays: 0,
    },
  });
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/auth/login");
      } else if (isAdmin) {
        router.replace("/admin");
      }
    }
  }, [loading, user, isAdmin, router]);

  useEffect(() => {
    let mounted = true;
    const loadUsers = async () => {
      try {
        const query = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
          search: search.trim(),
        });
        const url = `${API_BASE}/api/users/leaderboard?${query}`;
        const res = await fetch(url);
        if (!res.ok) {
          const errorData = await res.text();
          throw new Error(`HTTP ${res.status}: ${errorData}`);
        }
        const data = (await res.json()) as {
          total: number;
          users: Array<{
            id: string;
            firebaseUid: string;
            fullName?: string;
            email?: string;
            xpPoints?: number;
          }>;
        };
        if (!mounted) return;
        setTotalUsers(Number(data.total) || 0);
        setUsers(
          data.users.map((u) => ({
            uid: u.firebaseUid || u.id,
            email: u.email,
            fullName: u.fullName,
            xpPoints: u.xpPoints,
            _xp: Number(u.xpPoints) || 0,
            _name: (u.fullName || u.email || "Unknown").toString(),
          })),
        );
      } catch (e) {
        console.error("Failed to load users for leaderboard", e);
      }
    };
    loadUsers();
    return () => {
      mounted = false;
    };
  }, [page, pageSize, search]);

  useEffect(() => {
    if (!user?.uid) return;
    let mounted = true;
    const loadOverview = async () => {
      try {
        const query = new URLSearchParams({ firebaseUid: user.uid });
        const res = await fetch(`${API_BASE}/api/users/overview?${query}`);
        if (!res.ok) throw new Error("failed");
        const data = (await res.json()) as Overview;
        if (mounted) setOverview(data);
      } catch (error) {
        console.warn("Could not load user overview.");
      }
    };
    if (user?.uid) {
      loadOverview();
    }
    return () => {
      mounted = false;
    };
  }, [user?.uid]);

  useEffect(() => {
    setNotifications(loadNotifications());
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadSummary = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/catalog/summary`);
        if (!res.ok) {
          if (mounted) {
            setSummary({ subjects: 0, topics: 0, quizzes: 0 });
          }
          return;
        }
        const data = (await res.json()) as Summary;
        if (mounted) {
          setSummary({
            subjects: Number(data.subjects) || 0,
            topics: Number(data.topics) || 0,
            quizzes: Number(data.quizzes) || 0,
          });
          setLastUpdated(new Date().toLocaleTimeString());
        }
      } catch {
        if (mounted) {
          setSummary({ subjects: 0, topics: 0, quizzes: 0 });
        }
      }
    };

    loadSummary();
    const interval = setInterval(loadSummary, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading || !user) {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  const firstName = user.displayName?.split(" ")[0] || "Student";
  const greeting = getGreeting();
  const progressPercent =
    summary.topics > 0
      ? Math.min(
          100,
          Math.round((overview.stats.topicsDone / summary.topics) * 100),
        )
      : 0;

  const start = page * pageSize;

  return (
    <div className="space-y-6">
      <motion.section
        {...fadeUp}
        className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-md"
      >
        <p className="text-sm text-emerald-200">Welcome Back!</p>
        <h1 className="mt-1 text-2xl font-bold md:text-3xl">
          {greeting} {firstName}!
        </h1>
        <p className="mt-2 text-sm text-slate-200">
          Ready for today&apos;s learning experience?
        </p>
        <p className="mt-3 max-w-2xl rounded-lg bg-white/10 px-3 py-2 text-sm text-slate-100">
          Small progress daily builds strong exam confidence.
        </p>
      </motion.section>

      <motion.section
        {...fadeUp}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-500">Notifications</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              {
                notifications.filter((notification) => notification.unread)
                  .length
              }{" "}
              new alert
              {notifications.filter((notification) => notification.unread)
                .length === 1
                ? ""
                : "s"}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Stay on top of updates and reminders for your study progress.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-950 px-4 py-3 text-sm text-white">
            {notifications.length} total notifications
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => window.location.assign("/notifications")}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            View all notifications
          </button>
          <div className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
            Latest: {notifications[0]?.title || "No new alerts"}
          </div>
        </div>
      </motion.section>

      <motion.section
        {...fadeUp}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-3">
          <p className="text-xs text-slate-500">Continue Learning</p>
          <h3 className="mt-1 font-semibold text-slate-900">
            {overview.continueLearning
              ? `${overview.continueLearning}: Continue where you left off`
              : "No active subject yet. Add a subject to begin."}
          </h3>
          <div className="mt-3 h-2 rounded-full bg-slate-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8 }}
              className="h-2 rounded-full bg-emerald-500"
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Progress: {progressPercent}% ({overview.stats.topicsDone}/
            {summary.topics || 0} topics)
          </p>
          <button className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700">
            Resume
          </button>
        </article>
      </motion.section>

      <motion.section
        {...fadeUp}
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <article className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600">Total Subjects</p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {summary.subjects}
              </h3>
            </div>
            <FaBookOpen className="text-4xl text-blue-400 opacity-30" />
          </div>
          <p className="mt-3 text-xs text-slate-600">Available to explore</p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600">Total Topics</p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {summary.topics}
              </h3>
            </div>
            <FaTag className="text-4xl text-purple-400 opacity-30" />
          </div>
          <p className="mt-3 text-xs text-slate-600">Ready to learn</p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-gradient-to-br from-pink-50 to-pink-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600">Total Quizzes</p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {summary.quizzes}
              </h3>
            </div>
            <FaClipboardCheck className="text-4xl text-pink-400 opacity-30" />
          </div>
          <p className="mt-3 text-xs text-slate-600">Practice & improve</p>
        </article>
      </motion.section>
      <p className="text-xs text-slate-500">
        Last updated: {lastUpdated || "--"}
      </p>

      <motion.section
        {...fadeUp}
        className="grid grid-cols-1 gap-4 xl:grid-cols-2"
      >
        <article className="p-6">
          <h2 className="text-lg font-semibold text-slate-900">Quick Stats</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {(
              [
                ["Quizzes Taken", String(overview.stats.quizzesTaken), FaClock],
                ["Current Streak", `${overview.stats.streakDays}d`, FaFire],
                ["Avg Test", `${overview.stats.avgScore}%`, FaStar],
                ["Topics Done", String(overview.stats.topicsDone), FaBookOpen],
                ["Pending", String(overview.stats.pendingTasks), FaExclamation],
                ["AI Asked", String(overview.stats.aiAsked), FaRobot],
                [
                  "XP Points",
                  overview.stats.xpPoints.toLocaleString(),
                  FaCoins,
                ],
                ["Level", String(overview.stats.level), FaArrowUp],
                ["Badges", "0", FaMedal],
                ["Achievements", "0", FaTrophy],
              ] as [string, string, IconType][]
            ).map(([k, v, Icon], idx) => (
              <div
                key={k}
                className={`rounded-xl bg-slate-200 px-3 py-3 text-center shadow-md ${
                  idx % 4 === 0
                    ? "shadow-cyan-700/30"
                    : idx % 4 === 1
                      ? "shadow-emerald-700/30"
                      : idx % 4 === 2
                        ? "shadow-orange-700/30"
                        : "shadow-indigo-700/30"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Icon className="text-slate-500" size={18} aria-hidden />
                </div>
                <p className="mt-2 text-xs text-slate-500">{k}</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{v}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
            <FaBolt />
            Gamification active
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg text-center mb-2 font-semibold text-slate-900">
            eStudyHub Leaderboard
          </h2>
          <div className="flex items-center justify-center border-b-1 border-slate-200 pb-4">
            <div className="flex items-center justify-center gap-2">
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                placeholder="Search User"
                className="rounded-md border border-slate-200 bg-white px-3 py-2 w-80 text-sm outline-none"
              />
            </div>
          </div>
          <div className="mt-4 hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="pb-2">Rank</th>
                  <th className="pb-2">Name</th>
                  <th className="pb-2 text-right">XP</th>
                </tr>
              </thead>
              <tbody className="text-slate-800">
                {users.map((u: LeaderboardUser, idx: number) => (
                  <tr key={u.uid} className="border-t border-slate-100">
                    <td className="py-2 font-semibold">{start + idx + 1}</td>
                    <td className="py-2">{u._name}</td>
                    <td className="py-2 text-right font-semibold">
                      {u._xp.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 space-y-2 md:hidden">
            {users.map((u, idx) => (
              <div
                key={u.uid}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <p className="text-xs text-slate-500">
                  Rank #{start + idx + 1}
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {u._name}
                </p>
                <p className="text-xs text-slate-600">
                  XP: {u._xp.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Showing {Math.min(totalUsers, page * pageSize + 1)} -{" "}
              {Math.min(totalUsers, (page + 1) * pageSize)} of {totalUsers}
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="rounded-md border border-slate-200 px-3 py-1 text-sm disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={(page + 1) * pageSize >= totalUsers}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-md border border-slate-200 px-3 py-1 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </article>
      </motion.section>
    </div>
  );
}
