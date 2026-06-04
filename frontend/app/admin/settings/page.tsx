"use client";

import { FaShield } from "react-icons/fa6";

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-white p-8 shadow-sm shadow-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">
              Admin Settings
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Platform settings
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage your admin preferences, security settings, and notification
              options.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
            <FaShield /> Secure
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <article className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Admin access
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Everything in this area is restricted to administrators. Use your
              admin credentials and secure your session.
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Notification preferences
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Set how you want to receive platform messages, alerts, and course
              updates.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
