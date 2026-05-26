"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  AuthError,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaLock,
  FaSpinner,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { auth, db, googleProvider } from "@/lib/firebase";

function hostForFirebaseAllowlist() {
  if (typeof window === "undefined") return "your app domain";
  return window.location.hostname;
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError("Please fill out all required fields.");
      setPasswordMismatch(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setPasswordMismatch(true);
      return;
    }
    setPasswordMismatch(false);
    setBusy(true);
    setError("");
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password,
      );
      await updateProfile(credential.user, { displayName: name });
      const digits = phone.replace(/[^\d]/g, "");
      try {
        const normalizedEmail = email.trim().toLowerCase();
        await setDoc(
          doc(db, "users", credential.user.uid),
          {
            uid: credential.user.uid,
            fullName: name.trim(),
            email: normalizedEmail,
            phone: phone.trim(),
            phoneDigits: digits,
            provider: "password",
            role: "student",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
          },
          { merge: true },
        );
        await setDoc(
          doc(db, "usersByEmail", normalizedEmail),
          {
            uid: credential.user.uid,
            email: normalizedEmail,
            role: "student",
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
        if (digits) {
          await setDoc(doc(db, "phoneIndex", digits), {
            uid: credential.user.uid,
            email: normalizedEmail,
            updatedAt: serverTimestamp(),
          });
        }
      } catch {
        toast.error("Account created, but profile sync is pending.");
      }
      toast.success("Registration successful. Welcome to eStudy Hub.");
      router.push("/dashboard");
    } catch (firebaseError) {
      const error = firebaseError as AuthError;
      if (error.code === "auth/email-already-in-use") {
        setError("Account already exists with this email.");
        toast.error("Account already exists.");
      } else if (error.code === "auth/unauthorized-domain") {
        setError(
          `This domain is not authorized in Firebase. Add "${hostForFirebaseAllowlist()}" in Firebase Auth -> Authorized domains.`,
        );
        toast.error("Unauthorized domain for Firebase Auth.");
      } else if (error.code === "auth/network-request-failed") {
        setError("Network error. Check internet/firewall and try again.");
        toast.error("Network request failed.");
      } else {
        setError("Registration failed. Please verify details and try again.");
        toast.error("Registration failed.");
      }
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    setError("");
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      try {
        const normalizedEmail = (credential.user.email || "")
          .trim()
          .toLowerCase();
        await setDoc(
          doc(db, "users", credential.user.uid),
          {
            uid: credential.user.uid,
            fullName: credential.user.displayName || "",
            email: normalizedEmail,
            provider: "google",
            role: "student",
            updatedAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
            createdAt: serverTimestamp(),
          },
          { merge: true },
        );
        if (normalizedEmail) {
          await setDoc(
            doc(db, "usersByEmail", normalizedEmail),
            {
              uid: credential.user.uid,
              email: normalizedEmail,
              role: "student",
              updatedAt: serverTimestamp(),
            },
            { merge: true },
          );
        }
      } catch {
        toast.error("Signed up, but profile sync is pending.");
      }
      toast.success("Signed up with Google.");
      router.push("/dashboard");
    } catch {
      setError(
        `Google sign-up failed. If you're on a new network/domain, authorize "${hostForFirebaseAllowlist()}" in Firebase Auth settings.`,
      );
      toast.error("Google sign-up failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-slate-950 px-4 py-10 text-slate-100 flex items-center">
      <div className="mx-auto w-full max-w-5xl grid overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 shadow-2xl shadow-cyan-500/10 md:grid-cols-2">
        <div className="relative hidden p-10 md:block">
          <div className="absolute -top-12 -left-10 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-12 -right-12 h-52 w-52 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="relative">
            <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">
              eStudy Hub
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white">
              Create your account and start learning smarter.
            </h1>
          </div>
        </div>

        <div className="bg-slate-950/80 p-6 md:p-10">
          <h2 className="text-3xl font-bold text-white">Register</h2>
          <p className="mt-2 text-sm text-slate-400">
            Use your email and phone number to create account.
          </p>

          <form
            suppressHydrationWarning
            noValidate
            onSubmit={handleSubmit}
            className="mt-8 space-y-4"
          >
            <div className="relative">
              <FaUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                suppressHydrationWarning
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Full name"
                className="w-full rounded-xl border border-white/10 bg-slate-900 py-3 pl-10 pr-4 text-base md:text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300"
              />
            </div>
            <div className="relative">
              <FaEnvelope className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                suppressHydrationWarning
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email address"
                className="w-full rounded-xl border border-white/10 bg-slate-900 py-3 pl-10 pr-4 text-base md:text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300"
              />
            </div>
            <div className="relative">
              <FaPhoneAlt className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                suppressHydrationWarning
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="Phone number"
                className="w-full rounded-xl border border-white/10 bg-slate-900 py-3 pl-10 pr-4 text-base md:text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300"
              />
            </div>
            <div className="relative">
              <FaLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                suppressHydrationWarning
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className={`w-full rounded-xl border bg-slate-900 py-3 pl-10 pr-11 text-base md:text-sm outline-none placeholder:text-slate-500 ${
                  passwordMismatch
                    ? "border-rose-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/40"
                    : "border-white/10 focus:border-cyan-300"
                }`}
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
                suppressHydrationWarning
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm password"
                className={`w-full rounded-xl border bg-slate-900 py-3 pl-10 pr-11 text-base md:text-sm outline-none placeholder:text-slate-500 ${
                  passwordMismatch
                    ? "border-rose-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/40"
                    : "border-white/10 focus:border-cyan-300"
                }`}
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
              type="submit"
              className="w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-cyan-300 disabled:opacity-60"
            >
              <span className="inline-flex items-center gap-2">
                {busy ? <FaSpinner className="animate-spin" /> : null}
                Create Account
              </span>
            </button>
          </form>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold hover:bg-white/10 disabled:opacity-60"
          >
            <FaGoogle />
            Continue with Google
          </button>

          <p className="mt-6 text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-cyan-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <div className="mx-auto mt-6 w-full max-w-5xl rounded-3xl border border-white/10 bg-slate-900/60 px-4 py-4 text-slate-400 shadow-2xl shadow-cyan-500/10 sm:px-6">
        <div className="flex flex-col items-center gap-2 text-center text-sm sm:flex-row sm:justify-center sm:gap-3">
          <span>Need a different workspace?</span>
          <Link
            href="/landing"
            className="font-semibold text-cyan-300 hover:text-cyan-200"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
