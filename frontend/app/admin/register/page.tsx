"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaLock, FaSpinner, FaUser } from "react-icons/fa";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import type { AuthError } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import toast from "react-hot-toast";
import { auth, db } from "@/lib/firebase";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill out all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const credential = await createUserWithEmailAndPassword(
        auth,
        normalizedEmail,
        password,
      );
      await updateProfile(credential.user, { displayName: fullName.trim() });
      try {
        await setDoc(
          doc(db, "adminUsers", credential.user.uid),
          {
            uid: credential.user.uid,
            fullName: fullName.trim(),
            email: normalizedEmail,
            role: "admin",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
        await setDoc(
          doc(db, "adminUsersByEmail", normalizedEmail),
          {
            uid: credential.user.uid,
            email: normalizedEmail,
            role: "admin",
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
        await setDoc(
          doc(db, "users", credential.user.uid),
          {
            uid: credential.user.uid,
            fullName: fullName.trim(),
            email: normalizedEmail,
            provider: "password",
            role: "admin",
            updatedAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
            createdAt: serverTimestamp(),
          },
          { merge: true },
        );
        await setDoc(
          doc(db, "usersByEmail", normalizedEmail),
          {
            uid: credential.user.uid,
            email: normalizedEmail,
            role: "admin",
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
      } catch (syncError) {
        const firebaseSyncError = syncError as FirebaseError;
        if (firebaseSyncError.code === "permission-denied") {
          toast.error(
            "Admin profile sync blocked by Firestore rules, but account was created.",
          );
        } else {
          toast.error("Admin account created, but profile sync failed.");
        }
      }
      toast.success("Admin registered. Please login.");
      router.push("/admin/login");
    } catch (err) {
      const authError = err as AuthError;
      const message =
        authError.code === "auth/email-already-in-use"
          ? "Admin account already exists for this email."
          : authError.code === "auth/invalid-email"
            ? "Enter a valid email address."
            : authError.code === "auth/weak-password"
              ? "Password is too weak. Use at least 6 characters."
              : err instanceof Error
                ? err.message
                : "Failed to register admin.";
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 px-4 py-10 text-slate-100 flex items-center">
      <div className="mx-auto w-full max-w-5xl grid overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 shadow-2xl shadow-cyan-500/10 md:grid-cols-2">
        <div className="relative hidden p-10 md:block">
          <div className="absolute -top-12 -left-10 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-12 -right-12 h-52 w-52 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="relative">
            <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">
              Admin Portal
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white">
              Create your admin account to publish learning content.
            </h1>
          </div>
        </div>

        <div className="bg-slate-950/60 p-8 md:p-10">
          <h2 className="text-3xl font-bold text-white">Admin Register</h2>
          <p className="mt-2 text-sm text-slate-400">
            Create admin credentials to access the content dashboard.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="relative">
              <FaUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full name"
                className="w-full rounded-xl border border-white/10 bg-slate-900 py-3 pl-10 pr-4 text-base md:text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300"
              />
            </div>
            <div className="relative">
              <FaUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Admin email"
                className="w-full rounded-xl border border-white/10 bg-slate-900 py-3 pl-10 pr-4 text-base md:text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300"
              />
            </div>
            <div className="relative">
              <FaLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full rounded-xl border border-white/10 bg-slate-900 py-3 pl-10 pr-11 text-base md:text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="relative">
              <FaLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                className="w-full rounded-xl border border-white/10 bg-slate-900 py-3 pl-10 pr-11 text-base md:text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {error ? (
              <p className="rounded-lg border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-sm text-amber-200">
                {error}
              </p>
            ) : null}
            <button
              disabled={busy}
              className="w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-cyan-300 disabled:opacity-60"
            >
              <span className="inline-flex items-center gap-2">
                {busy ? <FaSpinner className="animate-spin" /> : null}
                Register
              </span>
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            Already an admin?{" "}
            <Link href="/admin/login" className="font-semibold text-cyan-300">
              Login
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
