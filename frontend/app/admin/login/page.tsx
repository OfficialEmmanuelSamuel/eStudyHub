"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaLock, FaSpinner, FaUser } from "react-icons/fa";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { auth, db } from "@/lib/firebase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const credential = await signInWithEmailAndPassword(
        auth,
        normalizedEmail,
        password,
      );

      const uid = credential.user.uid;

      // 🔐 ROLE CHECK (FIX)
      const adminSnap = await getDoc(doc(db, "adminUsers", uid));

      if (!adminSnap.exists() || adminSnap.data()?.role !== "admin") {
        await auth.signOut();
        throw new Error("NOT_ADMIN");
      }

      // update last login
      await setDoc(
        doc(db, "adminUsers", uid),
        {
          lastLoginAt: serverTimestamp(),
        },
        { merge: true },
      );

      toast.success("Admin login successful");
      router.replace("/admin");
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "NOT_ADMIN") {
        setError("You are not authorized as admin.");
        toast.error("Access denied");
      } else {
        setError("Invalid login details");
        toast.error("Login failed");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 px-4 py-10 text-slate-100 flex items-center">
      <div className="mx-auto w-full max-w-5xl grid overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 shadow-2xl shadow-cyan-500/10 md:grid-cols-2">
        {/* LEFT SIDE (UNCHANGED DESIGN) */}
        <div className="relative hidden p-10 md:block">
          <div className="absolute -top-12 -left-10 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-12 -right-12 h-52 w-52 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="relative">
            <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">
              Admin Portal
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white">
              Manage subjects, topics, and quizzes from one secure workspace.
            </h1>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-slate-950/60 p-8 md:p-10">
          <h2 className="text-3xl font-bold text-white">Admin Login</h2>
          <p className="mt-2 text-sm text-slate-400">
            Use your admin email and password.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Admin email"
                className="w-full rounded-xl border border-white/10 bg-slate-900 py-3 pl-10 pr-4 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300"
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full rounded-xl border border-white/10 bg-slate-900 py-3 pl-10 pr-11 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300"
              />

              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {error && (
              <p className="rounded-lg border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-sm text-amber-200">
                {error}
              </p>
            )}

            <button
              disabled={busy}
              className="w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-cyan-300 disabled:opacity-60"
            >
              <span className="inline-flex items-center gap-2">
                {busy ? <FaSpinner className="animate-spin" /> : null}
                Login
              </span>
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            No admin account?{" "}
            <Link
              href="/admin/register"
              className="font-semibold text-cyan-300"
            >
              Register
            </Link>
          </p>

          <div className="mt-6 flex justify-center">
            <Link
              href="/landing"
              className="inline-flex items-center rounded-full border border-white/10 bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
