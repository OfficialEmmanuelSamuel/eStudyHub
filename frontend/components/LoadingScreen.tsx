export default function LoadingScreen({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-[2rem] border border-slate-200/70 bg-white/95 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
        <div className="flex items-center justify-center">
          <div className="relative h-24 w-24">
            <span className="absolute inset-0 rounded-full border-4 border-slate-200" />
            <span className="absolute inset-0 rounded-full border-4 border-t-slate-900 border-slate-200 opacity-60 animate-spin" />
            <span className="absolute inset-[10%] rounded-full bg-emerald-500/10" />
            <span className="absolute inset-[22%] rounded-full bg-emerald-500/20" />
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg font-semibold text-slate-900">{message}</p>
          <p className="mt-2 text-sm text-slate-500">
            Please wait while we prepare your experience.
          </p>
        </div>
      </div>
    </div>
  );
}
