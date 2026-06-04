"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAdminAuth } from "@/context/AdminAuthProvider";
import { departmentSubjects } from "@/lib/subjectCatalog";
import { API_BASE } from "@/lib/apiBase";

export default function AddSubjectPage() {
  const router = useRouter();
  const { loading, isAdmin } = useAdminAuth();
  const [department, setDepartment] =
    useState<keyof typeof departmentSubjects>("General");
  const [selected, setSelected] = useState<string[]>([]);
  const [customSubject, setCustomSubject] = useState("");
  const [saving, setSaving] = useState(false);

  const presetSubjects = useMemo(
    () => departmentSubjects[department],
    [department],
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/admin/login");
    }
  }, [loading, isAdmin, router]);

  const toggleSubject = (name: string) => {
    setSelected((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name],
    );
  };

  const handleAddCustom = () => {
    const value = customSubject.trim();
    if (!value) return;
    setSelected((prev) => (prev.includes(value) ? prev : [...prev, value]));
    setCustomSubject("");
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!selected.length) {
      toast.error("Select at least one subject");
      return;
    }
    setSaving(true);
    try {
      const results = await Promise.all(
        selected.map(async (name) => {
          const response = await fetch(`${API_BASE}/api/admin/subjects`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, department, description: "" }),
          });

          if (!response.ok) {
            const payload = await response.json().catch(() => ({}));
            throw new Error(
              payload?.message || `Failed to save subject: ${name}`,
            );
          }

          return response.json();
        }),
      );

      toast.success(`${results.length} subject(s) saved to database`);
      setSelected([]);
    } catch {
      toast.error("Failed to save selected subjects");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-xl shadow-slate-950/20">
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">
          Admin Portal
        </p>
        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold">Add Subjects</h1>
            <p className="max-w-2xl text-sm text-slate-300">
              Add new subject categories and keep your department curriculum
              organized with fast subject creation.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 px-4 py-3 text-slate-100">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
              Current department
            </p>
            <p className="mt-2 text-lg font-semibold">{department}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <form
          onSubmit={handleSave}
          className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
        >
          <div className="p-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => {
                    setDepartment(
                      e.target.value as keyof typeof departmentSubjects,
                    );
                    setSelected([]);
                  }}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm"
                >
                  {Object.keys(departmentSubjects).map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col justify-end gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Quick actions
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelected([...presetSubjects])}
                    className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelected([])}
                    className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Deselect All
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-800">
                Pick from preset subjects
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {presetSubjects.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => toggleSubject(subject)}
                    className={`rounded-3xl border px-4 py-3 text-left text-sm transition ${
                      selected.includes(subject)
                        ? "border-emerald-400 bg-emerald-50 text-slate-900"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Add custom subject
                  </p>
                  <p className="text-sm text-slate-500">
                    Enter a new subject name to add it alongside the selected
                    items.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddCustom}
                  className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Add subject
                </button>
              </div>
              <input
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="Type custom subject…"
                className="mt-4 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm"
              />
            </div>

            {selected.length ? (
              <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                <p className="font-semibold">
                  Selected subjects ({selected.length})
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selected.map((name) => (
                    <span
                      key={name}
                      className="rounded-full bg-white px-3 py-1 text-slate-700 shadow-sm"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <button
              disabled={saving}
              className="mt-2 inline-flex w-full items-center justify-center rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving subjects…" : "Save subjects"}
            </button>
          </div>
        </form>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Summary
            </p>
            <div className="mt-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-3xl font-semibold">{selected.length}</p>
                <p className="mt-1 text-sm text-slate-400">subjects selected</p>
              </div>
              <div className="rounded-3xl bg-slate-900 px-4 py-3 text-center text-sm">
                Ready to publish
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Tips for subject creation
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>
                • Group related subjects under the same department for easier
                navigation.
              </li>
              <li>
                • Use clear, exam-style subject names for better student
                recognition.
              </li>
              <li>
                • Add only validated subject names to keep the catalog clean.
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
