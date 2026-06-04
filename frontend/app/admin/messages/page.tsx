"use client";

import { FaComments } from "react-icons/fa6";

export default function AdminMessagesPage() {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-white p-8 shadow-sm shadow-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">
              Admin Messages
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Complaint inbox
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Review incoming student messages and complaints in one place.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
            <FaComments /> 6 messages
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {[
            {
              id: "msg-1",
              subject: "Content correction request",
              preview:
                "Please update the Chemistry topic about electrolysis with the latest exam syllabus.",
              status: "New",
            },
            {
              id: "msg-2",
              subject: "Question issue on Mathematics quiz",
              preview:
                "A student says the answer key for question 7 is incorrect in the current quiz.",
              status: "Pending",
            },
          ].map((message) => (
            <article
              key={message.id}
              className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {message.subject}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {message.preview}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {message.status}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
