"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAdminAuth } from "@/context/AdminAuthProvider";
import { departmentSubjects } from "@/lib/subjectCatalog";
import { API_BASE } from "@/lib/apiBase";
import AdminNavbar from "@/components/AdminNavbar";

export default function AddSubjectPage() {
  const router = useRouter();
  const { loading, isAdmin, user } = useAdminAuth();
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
      <AdminNavbar />
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-md">
        <p className="text-sm text-emerald-200">Admin</p>
        <h1 className="mt-1 text-2xl font-bold md:text-3xl">Add Subject</h1>
      </section>

      <form
        onSubmit={handleSave}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <label className="text-sm font-medium text-slate-700">Department</label>
        <select
          value={department}
          onChange={(e) => {
            setDepartment(e.target.value as keyof typeof departmentSubjects);
            setSelected([]);
          }}
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
        >
          {Object.keys(departmentSubjects).map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelected([...presetSubjects])}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold"
          >
            Select All
          </button>
          <button
            type="button"
            onClick={() => setSelected([])}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold"
          >
            Deselect All
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
          {presetSubjects.map((subject) => (
            <label
              key={subject}
              className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                checked={selected.includes(subject)}
                onChange={() => toggleSubject(subject)}
              />
              {subject}
            </label>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-800">
            Add New Subject Name
          </p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              placeholder="Type custom subject"
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
            <button
              type="button"
              onClick={handleAddCustom}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Add
            </button>
          </div>
        </div>

        {selected.length ? (
          <div className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Selected: {selected.join(", ")}
          </div>
        ) : null}

        <button
          disabled={saving}
          className="mt-5 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
        >
          {saving ? "Saving..." : "Save Subjects"}
        </button>
      </form>
    </div>
  );
}
