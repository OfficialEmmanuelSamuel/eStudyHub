"use client";

import Link from "next/link";
import { FaBell, FaLifeRing } from "react-icons/fa6";

export default function AdminNotificationsPage() {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-white p-8 shadow-sm shadow-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">
              Admin Notifications
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Alerts & requests
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Monitor admin notices, content approvals, or important system
              alerts.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
            <FaBell /> 2 unresolved
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <article className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
              New request
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              User complaint received
            </h2>
            <p className="mt-3 text-slate-600">
              A student has submitted a complaint about course material. Review
              the message and follow up if needed.
            </p>
            <Link
              href="/admin/messages"
              className="mt-4 inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Review messages
            </Link>
          </article>

          <article className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
              System alert
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Publication queue update
            </h2>
            <p className="mt-3 text-slate-600">
              4 pending subject updates are waiting for approval before they
              appear to learners.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
