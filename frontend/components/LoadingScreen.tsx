export default function LoadingScreen({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center text-slate-900">
      <div className="text-center">
        <div className="animate-spin">
          <div className="rounded-full h-20 w-20 border-r-2 border-b-2 border-t-2 border-l-2 border-white border-r-emerald-300 border-l-emerald-300 mx-auto mb-4 flex items-center justify-center animate-spin">
            <div className="rounded-full h-12 w-12 border-r-2 border-b-2 border-t-2 border-l-2 border-white border-r-emerald-300 border-l-emerald-300 mx-auto flex items-center justify-center animate-spin">
              <div className="rounded-full h-4 w-4 mx-auto bg-emerald-900 animate-pulse" />
            </div>
          </div>
        </div>
        <p>{message}</p>
      </div>
    </div>
  );
}
