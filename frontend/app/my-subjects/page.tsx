"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaBookOpen, FaCircleExclamation, FaTrash } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE } from "@/lib/apiBase";
import LoadingScreen from "@/components/LoadingScreen";

type SavedSubject = {
  id: string;
  department: string;
  category: string;
  name: string;
};

type SubjectWithProgress = SavedSubject & {
  progress: number;
  weakness: "Low" | "Medium" | "High";
  upcomingTest: string;
};

export default function MySubjectsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [subjects, setSubjects] = useState<SubjectWithProgress[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoadingSubjects(true);
      try {
        const res = await fetch(
          `${API_BASE}/api/subjects?firebaseUid=${encodeURIComponent(user.uid)}`,
        );
        if (!res.ok) throw new Error("failed");
        const data = (await res.json()) as SavedSubject[];
        const withProgress = data.map((subject, index) => {
          const progress = ((index * 23 + subject.name.length * 7) % 81) + 20;
          const weakness: SubjectWithProgress["weakness"] =
            progress < 50 ? "High" : progress < 75 ? "Medium" : "Low";
          return {
            ...subject,
            progress: Math.min(progress, 100),
            weakness,
            upcomingTest: `${["Mon", "Tue", "Wed", "Thu", "Fri"][index % 5]} - ${["9:00 AM", "11:30 AM", "2:00 PM"][index % 3]}`,
          };
        });
        setSubjects(withProgress);
      } catch {
        toast.error("Could not load My Subjects.");
      } finally {
        setLoadingSubjects(false);
      }
    };
    load();
  }, [user]);

  const handleRemove = async (name: string) => {
    if (!user) return;
    setRemoving(name);
    try {
      const res = await fetch(`${API_BASE}/api/subjects`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebaseUid: user.uid, name }),
      });
      if (!res.ok) throw new Error("failed");
      setSubjects((prev) => prev.filter((item) => item.name !== name));
      toast.success("Subject removed");
    } catch {
      toast.error("Could not remove subject.");
    } finally {
      setRemoving(null);
    }
  };

  if (loading || !user || loadingSubjects) {
    return <LoadingScreen message="Loading My Subjects..." />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-md">
        <p className="text-sm text-emerald-200">Personalized Learning</p>
        <h1 className="mt-1 text-2xl font-bold md:text-3xl">My Subjects</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-200">
          These are the subjects you selected from your department categories.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {subjects.length === 0 ? (
          <p className="text-sm text-slate-500">
            No subjects selected yet. Go to Subjects page and click Study.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <FaBookOpen className="text-emerald-600" />
                      {subject.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {subject.department}
                    </p>
                    <p className="text-xs text-slate-500">{subject.category}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(subject.name)}
                    disabled={removing === subject.name}
                    className="rounded-md bg-rose-100 p-2 text-rose-700 hover:bg-rose-200 disabled:opacity-60"
                    aria-label={`Remove ${subject.name}`}
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <p className="text-slate-500">Progress</p>
                    <p className="font-semibold text-slate-700">
                      {subject.progress}%
                    </p>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{ width: `${subject.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  <FaCircleExclamation />
                  Weakness indicator: {subject.weakness}
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Upcoming test: {subject.upcomingTest}
                </p>

                {subject.progress < 100 ? (
                  <button
                    type="button"
                    className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
                  >
                    Continue Learning
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
