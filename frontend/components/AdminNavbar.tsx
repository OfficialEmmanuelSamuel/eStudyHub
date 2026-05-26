"use client";

import Link from "next/link";

export default function AdminNavbar() {
  return (
    <nav className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <Link href="/admin" className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
        Admin Home
      </Link>
      <Link href="/admin/add-subject" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
        Add Subject
      </Link>
      <Link href="/admin/add-topics" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
        Add Topics
      </Link>
      <Link href="/admin/add-quiz" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
        Add Quiz
      </Link>
    </nav>
  );
}

