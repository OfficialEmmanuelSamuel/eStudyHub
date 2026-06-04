"use client";

import { useEffect, useMemo, useState } from "react";
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
import ConfirmModal from "@/components/ConfirmModal";
import toast from "react-hot-toast";

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

type Quiz = {
  id: string;
  question: string;
  topic?: {
    id: string;
    title: string;
  } | null;
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
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedDepartmentTopic, setSelectedDepartmentTopic] =
    useState<string>("");
  const [selectedDepartmentQuiz, setSelectedDepartmentQuiz] =
    useState<string>("");
  const [selectedTopicSubjectId, setSelectedTopicSubjectId] =
    useState<string>("");
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");
  const [selectedQuizSubjectId, setSelectedQuizSubjectId] =
    useState<string>("");
  const [selectedQuizId, setSelectedQuizId] = useState<string>("");
  const [topicsForTopicDeletion, setTopicsForTopicDeletion] = useState<Topic[]>(
    [],
  );
  const [quizzesForQuizDeletion, setQuizzesForQuizDeletion] = useState<Quiz[]>(
    [],
  );
  const [departmentConfirm, setDepartmentConfirm] = useState<string>("");

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

  const reloadSubjects = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/catalog/subjects`);
      if (!res.ok) throw new Error("Failed to fetch subjects");
      const data = (await res.json()) as Subject[];
      setSubjects(data);

      const departmentNames = Array.from(
        new Set(data.map((subject) => subject.department).filter(Boolean)),
      ).sort((a, b) => a.localeCompare(b));
      const fallbackSubjectId = data[0]?.id || "";
      const fallbackDepartment = departmentNames[0] || "";

      setSelectedSubjectId((current) =>
        current && data.some((subject) => subject.id === current)
          ? current
          : fallbackSubjectId,
      );
      setSelectedTopicSubjectId((current) =>
        current && data.some((subject) => subject.id === current)
          ? current
          : fallbackSubjectId,
      );
      setSelectedQuizSubjectId((current) =>
        current && data.some((subject) => subject.id === current)
          ? current
          : fallbackSubjectId,
      );
      setSelectedDepartment((current) =>
        current && departmentNames.includes(current)
          ? current
          : fallbackDepartment,
      );
      setSelectedDepartmentTopic((current) =>
        current && departmentNames.includes(current)
          ? current
          : fallbackDepartment,
      );
      setSelectedDepartmentQuiz((current) =>
        current && departmentNames.includes(current)
          ? current
          : fallbackDepartment,
      );
    } catch (error) {
      console.warn(error);
    }
  };

  const departments = useMemo(
    () =>
      Array.from(
        new Set(subjects.map((subject) => subject.department).filter(Boolean)),
      ).sort((a, b) => a.localeCompare(b)),
    [subjects],
  );

  const subjectsForDepartment = useMemo(
    () =>
      subjects.filter((subject) => subject.department === selectedDepartment),
    [subjects, selectedDepartment],
  );

  const topicsSubjectOptions = useMemo(
    () =>
      subjects.filter(
        (subject) => subject.department === selectedDepartmentTopic,
      ),
    [subjects, selectedDepartmentTopic],
  );

  const quizzesSubjectOptions = useMemo(
    () =>
      subjects.filter(
        (subject) => subject.department === selectedDepartmentQuiz,
      ),
    [subjects, selectedDepartmentQuiz],
  );

  useEffect(() => {
    if (!subjects.length) return;

    const firstSubjectId = subjects[0]?.id || "";
    const firstDepartment = departments[0] || "";

    if (!selectedDepartment) {
      setSelectedDepartment(firstDepartment);
    }
    if (!selectedDepartmentTopic) {
      setSelectedDepartmentTopic(firstDepartment);
    }
    if (!selectedDepartmentQuiz) {
      setSelectedDepartmentQuiz(firstDepartment);
    }
    if (!selectedSubjectId) {
      setSelectedSubjectId(firstSubjectId);
    }
    if (!selectedTopicSubjectId) {
      setSelectedTopicSubjectId(firstSubjectId);
    }
    if (!selectedQuizSubjectId) {
      setSelectedQuizSubjectId(firstSubjectId);
    }
  }, [
    departments,
    selectedDepartment,
    selectedDepartmentTopic,
    selectedDepartmentQuiz,
    selectedSubjectId,
    selectedTopicSubjectId,
    selectedQuizSubjectId,
    subjects,
  ]);

  useEffect(() => {
    if (
      subjectsForDepartment.length &&
      !subjectsForDepartment.some((subject) => subject.id === selectedSubjectId)
    ) {
      setSelectedSubjectId(subjectsForDepartment[0].id);
    }
  }, [subjectsForDepartment, selectedSubjectId]);

  useEffect(() => {
    if (
      topicsSubjectOptions.length &&
      !topicsSubjectOptions.some(
        (subject) => subject.id === selectedTopicSubjectId,
      )
    ) {
      setSelectedTopicSubjectId(topicsSubjectOptions[0].id);
    }
  }, [topicsSubjectOptions, selectedTopicSubjectId]);

  useEffect(() => {
    if (
      quizzesSubjectOptions.length &&
      !quizzesSubjectOptions.some(
        (subject) => subject.id === selectedQuizSubjectId,
      )
    ) {
      setSelectedQuizSubjectId(quizzesSubjectOptions[0].id);
    }
  }, [quizzesSubjectOptions, selectedQuizSubjectId]);

  useEffect(() => {
    if (!selectedTopicSubjectId) return;

    const loadTopicOptions = async () => {
      setManagementLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/api/catalog/subjects/${selectedTopicSubjectId}/topics`,
        );
        if (!res.ok) throw new Error("Failed to fetch topic options");
        const data = (await res.json()) as Topic[];
        setTopicsForTopicDeletion(data);
      } catch (error) {
        console.warn(error);
        setTopicsForTopicDeletion([]);
      } finally {
        setManagementLoading(false);
      }
    };

    loadTopicOptions();
  }, [selectedTopicSubjectId]);

  useEffect(() => {
    if (!selectedQuizSubjectId) return;

    const loadQuizOptions = async () => {
      setManagementLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/api/catalog/subjects/${selectedQuizSubjectId}/quizzes`,
        );
        if (!res.ok) throw new Error("Failed to fetch quiz options");
        const data = (await res.json()) as Quiz[];
        setQuizzesForQuizDeletion(data);
      } catch (error) {
        console.warn(error);
        setQuizzesForQuizDeletion([]);
      } finally {
        setManagementLoading(false);
      }
    };

    loadQuizOptions();
  }, [selectedQuizSubjectId]);

  useEffect(() => {
    if (
      topicsForTopicDeletion.length &&
      !topicsForTopicDeletion.some((topic) => topic.id === selectedTopicId)
    ) {
      setSelectedTopicId(topicsForTopicDeletion[0].id);
    }
    if (!topicsForTopicDeletion.length) {
      setSelectedTopicId("");
    }
  }, [topicsForTopicDeletion, selectedTopicId]);

  useEffect(() => {
    if (
      quizzesForQuizDeletion.length &&
      !quizzesForQuizDeletion.some((quiz) => quiz.id === selectedQuizId)
    ) {
      setSelectedQuizId(quizzesForQuizDeletion[0].id);
    }
    if (!quizzesForQuizDeletion.length) {
      setSelectedQuizId("");
    }
  }, [quizzesForQuizDeletion, selectedQuizId]);

  useEffect(() => {
    if (!isAdmin) return;

    const loadSubjects = async () => {
      setManagementLoading(true);
      try {
        await reloadSubjects();
      } finally {
        setManagementLoading(false);
      }
    };

    loadSubjects();
  }, [isAdmin]);

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
    openModal({
      action: "deleteSubject",
      title: "Delete Subject",
      message:
        "Delete this subject and all related topics/quizzes? This cannot be undone.",
      payload: { subjectId },
    });
  };

  const deleteTopic = async (topicId: string) => {
    openModal({
      action: "deleteTopic",
      title: "Delete Topic",
      message: "Delete this topic permanently?",
      payload: { topicId },
    });
  };

  const deleteTopicContent = async (topicId: string) => {
    openModal({
      action: "deleteTopicContent",
      title: "Clear Topic Content",
      message:
        "Remove content and image from this topic? This keeps the topic title.",
      payload: { topicId },
    });
  };

  const deleteDepartment = async () => {
    if (!selectedDepartment) return;
    if (selectedDepartment.trim() !== departmentConfirm.trim()) {
      toast.error("Please enter the exact department name before deleting.");
      return;
    }

    openModal({
      action: "deleteDepartment",
      title: "Delete Department",
      message: `Are you sure you want to delete the ${selectedDepartment} department and all of its subjects? This cannot be undone.`,
      payload: { department: selectedDepartment },
    });
  };

  const deleteTopicSelection = async () => {
    if (!selectedTopicId) return;
    const topic = topicsForTopicDeletion.find(
      (item) => item.id === selectedTopicId,
    );
    openModal({
      action: "deleteTopicSelection",
      title: "Delete Topic",
      message: `Are you sure you want to delete "${topic?.title || "this topic"}"?`,
      payload: { topicId: selectedTopicId },
    });
  };

  const deleteQuizSelection = async () => {
    if (!selectedQuizId) return;
    const quiz = quizzesForQuizDeletion.find(
      (item) => item.id === selectedQuizId,
    );
    openModal({
      action: "deleteQuizSelection",
      title: "Delete Quiz",
      message: `Are you sure you want to delete "${quiz?.question.slice(0, 80) || "this quiz"}"?`,
      payload: { quizId: selectedQuizId },
    });
  };

  // Modal state and helpers
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<string | null>(null);
  const [modalPayload, setModalPayload] = useState<any>(null);
  const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);
  const [modalMessage, setModalMessage] = useState<React.ReactNode>(undefined);

  const openModal = ({
    action,
    title,
    message,
    payload,
  }: {
    action: string;
    title?: string;
    message?: React.ReactNode;
    payload?: any;
  }) => {
    setModalAction(action);
    setModalTitle(title);
    setModalMessage(message);
    setModalPayload(payload);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalAction(null);
    setModalPayload(null);
    setModalTitle(undefined);
    setModalMessage(undefined);
  };

  const handleModalConfirm = async () => {
    if (!modalAction) return closeModal();
    try {
      if (modalAction === "deleteSubject") {
        const { subjectId } = modalPayload;
        const res = await fetch(`${API_BASE}/api/admin/subjects/${subjectId}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Delete failed");
        await reloadSubjects();
        await reloadTopics();
        toast.success("Subject deleted successfully.");
      }

      if (modalAction === "deleteTopic") {
        const { topicId } = modalPayload;
        const res = await fetch(`${API_BASE}/api/admin/topics/${topicId}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Delete failed");
        await reloadTopics();
        toast.success("Topic deleted successfully.");
      }

      if (modalAction === "deleteTopicContent") {
        const { topicId } = modalPayload;
        const res = await fetch(
          `${API_BASE}/api/admin/topics/${topicId}/content`,
          { method: "DELETE" },
        );
        if (!res.ok) throw new Error("Delete failed");
        await reloadTopics();
        toast.success("Topic content cleared.");
      }

      if (modalAction === "deleteDepartment") {
        const { department } = modalPayload;
        const res = await fetch(
          `${API_BASE}/api/admin/departments/${encodeURIComponent(department)}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ departmentName: department }),
          },
        );
        if (!res.ok) throw new Error("Delete failed");
        await reloadSubjects();
        await reloadTopics();
        setDepartmentConfirm("");
        toast.success("Department deleted successfully.");
      }

      if (modalAction === "deleteTopicSelection") {
        const { topicId } = modalPayload;
        const res = await fetch(`${API_BASE}/api/admin/topics/${topicId}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Delete failed");
        await reloadTopics();
        setSelectedTopicId("");
        toast.success("Topic deleted successfully.");
      }

      if (modalAction === "deleteQuizSelection") {
        const { quizId } = modalPayload;
        const res = await fetch(`${API_BASE}/api/admin/quizzes/${quizId}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Delete failed");
        await reloadSubjects();
        await reloadTopics();
        setSelectedQuizId("");
        toast.success("Quiz deleted successfully.");
      }
    } catch (error) {
      console.warn(error);
      toast.error("Could not complete delete action.");
    } finally {
      closeModal();
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
      <main className="mx-auto max-w-7xl px-6 pb-10 pt-10">
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
                Manage Subjects, Topics & Quizzes
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Delete departments, subjects, topics, or quizzes with guided
                selection.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
              <h3 className="text-lg font-semibold text-white">
                Delete Department
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Remove an entire department and all subjects that belong to it.
              </p>
              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-200">
                    Department
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                  >
                    {departments.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-sm text-slate-400">
                  Subjects in this department:{" "}
                  {
                    subjects.filter(
                      (subject) => subject.department === selectedDepartment,
                    ).length
                  }
                </p>
                <div>
                  <label className="text-sm font-medium text-slate-200">
                    Confirm department name
                  </label>
                  <input
                    value={departmentConfirm}
                    onChange={(e) => setDepartmentConfirm(e.target.value)}
                    placeholder="Type department name exactly"
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                  />
                </div>
                <button
                  type="button"
                  onClick={deleteDepartment}
                  disabled={!selectedDepartment}
                  className="w-full rounded-lg bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-50"
                >
                  Delete Department
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
              <h3 className="text-lg font-semibold text-white">
                Delete Subject
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Pick a department and subject, then remove it and its content.
              </p>
              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-200">
                    Department
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                  >
                    {departments.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-200">
                    Subject
                  </label>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                  >
                    {subjectsForDepartment.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    selectedSubjectId && deleteSubject(selectedSubjectId)
                  }
                  disabled={!selectedSubjectId}
                  className="w-full rounded-lg bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-50"
                >
                  Delete selected subject
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
              <h3 className="text-lg font-semibold text-white">Delete Topic</h3>
              <p className="mt-2 text-sm text-slate-400">
                Choose department, subject, and topic before deletion.
              </p>
              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-200">
                    Department
                  </label>
                  <select
                    value={selectedDepartmentTopic}
                    onChange={(e) => setSelectedDepartmentTopic(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                  >
                    {departments.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-200">
                    Subject
                  </label>
                  <select
                    value={selectedTopicSubjectId}
                    onChange={(e) => setSelectedTopicSubjectId(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                  >
                    {topicsSubjectOptions.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-200">
                    Topic
                  </label>
                  <select
                    value={selectedTopicId}
                    onChange={(e) => setSelectedTopicId(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                  >
                    {topicsForTopicDeletion.map((topic) => (
                      <option key={topic.id} value={topic.id}>
                        {topic.title}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={deleteTopicSelection}
                  disabled={!selectedTopicId}
                  className="w-full rounded-lg bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-50"
                >
                  Delete selected topic
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
              <h3 className="text-lg font-semibold text-white">Delete Quiz</h3>
              <p className="mt-2 text-sm text-slate-400">
                Choose department, subject, and quiz before deletion.
              </p>
              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-200">
                    Department
                  </label>
                  <select
                    value={selectedDepartmentQuiz}
                    onChange={(e) => setSelectedDepartmentQuiz(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                  >
                    {departments.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-200">
                    Subject
                  </label>
                  <select
                    value={selectedQuizSubjectId}
                    onChange={(e) => setSelectedQuizSubjectId(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                  >
                    {quizzesSubjectOptions.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-200">
                    Quiz
                  </label>
                  <select
                    value={selectedQuizId}
                    onChange={(e) => setSelectedQuizId(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                  >
                    {quizzesForQuizDeletion.map((quiz) => (
                      <option key={quiz.id} value={quiz.id}>
                        {quiz.question.slice(0, 80)}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={deleteQuizSelection}
                  disabled={!selectedQuizId}
                  className="w-full rounded-lg bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-50"
                >
                  Delete selected quiz
                </button>
              </div>
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
      <ConfirmModal
        open={modalOpen}
        title={modalTitle}
        message={modalMessage}
        confirmLabel="Yes, delete"
        cancelLabel="Cancel"
        onConfirm={handleModalConfirm}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}
