import Link from "next/link";

export default function WaecQuizPage() {
  return (
    <main className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">WAEC Quiz</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">WAEC Practice Quiz</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          This page is ready for WAEC quiz sessions. You can now plug in question banks, timer logic, and scoring.
        </p>
        <Link
          href="/quiz"
          className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Back to Quiz Hub
        </Link>
      </div>
    </main>
  );
}
