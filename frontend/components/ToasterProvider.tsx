"use client";

import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { Toaster, ToastBar, resolveValue, toast } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      containerStyle={{
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
      toastOptions={{
        duration: Infinity,
        style: {
          background: "transparent",
          boxShadow: "none",
          border: "none",
          padding: "0",
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ message }) => (
            <div
              className={`mx-auto flex w-[280px] flex-col items-center rounded-2xl border bg-white px-5 py-6 text-center shadow-2xl transition-all duration-300 ${
                t.visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
              } ${t.type === "error" ? "border-rose-100" : "border-slate-200"}`}
            >
              <div className="mb-3 rounded-full border-4 border-slate-200 p-3">
                {t.type === "error" ? (
                  <FaCircleXmark className="text-5xl text-rose-500" />
                ) : (
                  <FaCircleCheck className="text-5xl text-slate-900" />
                )}
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {t.type === "error" ? "error!" : "successful!"}
              </p>
              <div className="mt-2 text-sm text-slate-500">
                {resolveValue(message, t)}
              </div>
              <button
                type="button"
                onClick={() => toast.dismiss(t.id)}
                className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
              >
                OK
              </button>
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}
