"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthProvider";
import LoadingScreen from "@/components/LoadingScreen";
import Link from "next/link";
import {
  FaSignOutAlt,
  FaBook,
  FaQuestionCircle,
  FaTag,
  FaTrashAlt,
  FaEraser,
  FaTimesCircle,
} from "react-icons/fa";
import { API_BASE } from "@/lib/apiBase";

type Summary = {
  subjects: number;
  topics: number;
  quizzes: number;
};

type Subject = { id: string; name: string; department: string };

type Topic = {
  id: string;
  title: string;
  description?: string;
  content?: string;
  imageUrl?: string;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, adminData, loading, isAdmin, logout } = useAdminAuth();
  const [summary, setSummary] = useState<Summary>({
    subjects: 0,
    topics: 0,
    quizzes: 0,
  });
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [managementLoading, setManagementLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/admin/login");
    }
  }, [loading, isAdmin, router]);

  useEffect(() => {
    if (!isAdmin) return;
    const loadSummary = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/catalog/summary`);
        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));
          console.warn(
            "Summary endpoint unavailable:",
            payload?.message || res.status,
          );
          return;
        }
        const data = (await res.json()) as Summary;
        setSummary({
          subjects: Number(data.subjects) || 0,
          topics: Number(data.topics) || 0,
          quizzes: Number(data.quizzes) || 0,
        });
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (error) {
        console.warn("Could not load admin summary right now.");
      }
    };

    // Initial load
    loadSummary();

    // Set up real-time polling every 5 seconds
    const interval = setInterval(loadSummary, 5000);

    // Cleanup interval on unmount or when isAdmin changes
    return () => clearInterval(interval);
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;

    const loadSubjects = async () => {
      setManagementLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/catalog/subjects`);
        if (!res.ok) throw new Error("Failed to fetch subjects");
        const data = (await res.json()) as Subject[];
        setSubjects(data);
        if (data.length && !selectedSubjectId) {
          setSelectedSubjectId(data[0].id);
        }
      } catch (error) {
        console.warn(error);
      } finally {
        setManagementLoading(false);
      }
    };

    loadSubjects();
  }, [isAdmin, selectedSubjectId]);

  useEffect(() => {
    if (!isAdmin || !selectedSubjectId) return;

    const loadTopics = async () => {
      setManagementLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/api/catalog/subjects/${selectedSubjectId}/topics`,
        );
        if (!res.ok) throw new Error("Failed to fetch topics");
        const data = (await res.json()) as Topic[];
        setTopics(data);
      } catch (error) {
        console.warn(error);
      } finally {
        setManagementLoading(false);
      }
    };

    loadTopics();
  }, [isAdmin, selectedSubjectId]);

  const reloadSubjects = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/catalog/subjects`);
      if (!res.ok) throw new Error("Failed to fetch subjects");
      const data = (await res.json()) as Subject[];
      setSubjects(data);
      if (
        data.length &&
        !data.some((subject) => subject.id === selectedSubjectId)
      ) {
        setSelectedSubjectId(data[0]?.id || "");
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const reloadTopics = async () => {
    if (!selectedSubjectId) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/catalog/subjects/${selectedSubjectId}/topics`,
      );
      if (!res.ok) throw new Error("Failed to fetch topics");
      const data = (await res.json()) as Topic[];
      setTopics(data);
    } catch (error) {
      console.warn(error);
    }
  };

  const deleteSubject = async (subjectId: string) => {
    const confirmed = window.confirm(
      "Delete this subject and all related topics/quizzes? This cannot be undone.",
    );
    if (!confirmed) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/subjects/${subjectId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      await reloadSubjects();
      await reloadTopics();
    } catch (error) {
      console.warn(error);
      alert("Could not delete subject.");
    }
  };

  const deleteTopic = async (topicId: string) => {
    const confirmed = window.confirm("Delete this topic permanently?");
    if (!confirmed) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/topics/${topicId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      await reloadTopics();
    } catch (error) {
      console.warn(error);
      alert("Could not delete topic.");
    }
  };

  const deleteTopicContent = async (topicId: string) => {
    const confirmed = window.confirm(
      "Remove content and image from this topic? This keeps the topic title.",
    );
    if (!confirmed) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/topics/${topicId}/content`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) throw new Error("Delete content failed");
      await reloadTopics();
    } catch (error) {
      console.warn(error);
      alert("Could not clear topic content.");
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* HEADER */}
      <header className="fixed inset-x-0 top-0 z-40 shadow-sm shadow-white/10 bg-slate-900/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm text-emerald-200 mt-1">
              Welcome, {adminData?.fullName || user?.displayName || "Admin"}
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-200/20 shadow-sm shadow-grey-200 text-white hover:bg-red-500/20 transition"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-7xl px-6 pb-10 pt-28">
        {/* STATS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="flex items-center flex-col p-6 rounded-lg bg-gradient-to-br from-cyan-100/50 to-cyan-500/5 shadow-sm shadow-white/10">
            <div className="text-3xl font-bold text-white">
              {summary.subjects.toLocaleString()}
            </div>
            <p className="text-sm text-slate-400 mt-2">Total Subjects</p>
          </div>
          <div className="flex items-center flex-col p-6 rounded-lg bg-gradient-to-br from-blue-100/50 to-blue-500/5 shadow-sm shadow-white/10">
            <div className="text-3xl font-bold text-white">
              {summary.topics.toLocaleString()}
            </div>
            <p className="text-sm text-slate-400 mt-2">Total Topics</p>
          </div>
          <div className="flex items-center flex-col p-6 rounded-lg bg-gradient-to-br from-purple-100/50 to-purple-500/5 shadow-sm shadow-white/10">
            <div className="text-3xl font-bold text-white">
              {summary.quizzes.toLocaleString()}
            </div>
            <p className="text-sm text-slate-400 mt-2">Total Quizzes</p>
          </div>
          <div className="flex items-center flex-col p-6 rounded-lg bg-gradient-to-br from-green-100/50 to-green-500/5 shadow-sm shadow-white/10">
            <div className="text-3xl font-bold text-white">0</div>
            <p className="text-sm text-slate-400 mt-2">Active Users</p>
          </div>
        </div>
        <p className="mb-10 text-xs text-slate-400">
          Last updated: {lastUpdated || "--"}
        </p>

        {/* QUICK ACTIONS */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/add-subject"
              className="p-6 rounded-lg bg-gradient-to-br from-cyan-500/50 to-cyan-500/5 shadow shadow-cyan-500/30 hover:border-cyan-400/60 transition group"
            >
              <FaBook className="text-3xl text-cyan-400 mb-3 group-hover:scale-110 transition" />
              <h3 className="font-semibold text-white">Add Subject</h3>
              <p className="text-xs text-slate-400 mt-1">
                Create new learning subject
              </p>
            </Link>

            <Link
              href="/admin/add-topics"
              className="p-6 rounded-lg bg-gradient-to-br from-blue-500/50 to-blue-500/5 shadow shadow-blue-500/30 hover:border-blue-400/60 transition group"
            >
              <FaTag className="text-3xl text-blue-400 mb-3 group-hover:scale-110 transition" />
              <h3 className="font-semibold text-white">Add Topics</h3>
              <p className="text-xs text-slate-400 mt-1">
                Add topics to subjects
              </p>
            </Link>

            <Link
              href="/admin/add-quiz"
              className="p-6 rounded-lg bg-gradient-to-br from-purple-500/50 to-purple-500/5 shadow shadow-purple-500/30 hover:border-purple-400/60 transition group"
            >
              <FaQuestionCircle className="text-3xl text-purple-400 mb-3 group-hover:scale-110 transition" />
              <h3 className="font-semibold text-white">Add Quiz</h3>
              <p className="text-xs text-slate-400 mt-1">
                Create new quiz questions
              </p>
            </Link>

            <Link
              href="/admin/register"
              className="p-6 rounded-lg bg-gradient-to-br from-green-500/50 to-green-500/5 shadow shadow-green-500/30 hover:border-green-400/60 transition group"
            >
              <FaSignOutAlt className="text-3xl text-green-400 mb-3 group-hover:scale-110 transition" />
              <h3 className="font-semibold text-white">Register Admin</h3>
              <p className="text-xs text-slate-400 mt-1">Add new admin user</p>
            </Link>
          </div>
        </div>

        <section className="mb-10 rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Manage Subjects & Topics
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Delete subjects, remove topics, or clear topic content from the
                platform.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-200">
                Subject
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
              >
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-950 p-4 text-sm text-slate-300">
              <span>{subjects.length} subjects loaded</span>
              <button
                type="button"
                onClick={() =>
                  selectedSubjectId && deleteSubject(selectedSubjectId)
                }
                disabled={!selectedSubjectId}
                className="rounded-lg bg-rose-600 px-4 py-2 text-white transition hover:bg-rose-500 disabled:opacity-50"
              >
                Delete selected subject
              </button>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
              <table className="min-w-full text-left text-sm text-slate-200">
                <thead className="bg-slate-900 text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Topic</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Content</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {managementLoading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-6 text-center text-slate-400"
                      >
                        Loading topics...
                      </td>
                    </tr>
                  ) : topics.length ? (
                    topics.map((topic) => (
                      <tr key={topic.id} className="border-t border-slate-800">
                        <td className="px-4 py-4 font-semibold text-white">
                          {topic.title}
                        </td>
                        <td className="px-4 py-4 text-slate-300">
                          {topic.description || "—"}
                        </td>
                        <td className="px-4 py-4 text-slate-300">
                          {topic.content ? "Has content" : "No content"}
                        </td>
                        <td className="px-4 py-4 space-x-2">
                          <button
                            type="button"
                            onClick={() => deleteTopicContent(topic.id)}
                            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 hover:border-slate-500"
                          >
                            <FaEraser className="inline mr-2" /> Remove Content
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteTopic(topic.id)}
                            className="rounded-lg bg-rose-600 px-3 py-2 text-xs text-white hover:bg-rose-500"
                          >
                            <FaTrashAlt className="inline mr-2" /> Delete Topic
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-6 text-center text-slate-400"
                      >
                        No topics found for this subject.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* RECENT ACTIVITY */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            Recent Activity
          </h2>
          <div className="p-6 rounded-lg bg-slate-900/60 border border-white/10">
            <p className="text-slate-400 text-center py-8">
              No recent activity yet
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
