"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  FaGoogle,
  FaSpinner,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaEnvelope,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { auth, db, googleProvider } from "@/lib/firebase";
import { API_BASE } from "@/lib/apiBase";

async function resolveEmail(identifier: string) {
  const value = identifier.trim().toLowerCase();

  if (value.includes("@")) return value;

  const digits = value.replace(/[^\d]/g, "");
  if (!digits) throw new Error("invalid");

  const snap = await getDoc(doc(db, "phoneIndex", digits));
  if (!snap.exists()) throw new Error("not-found");

  const email = snap.data().email;
  if (!email || typeof email !== "string") throw new Error("not-found");
  return email.trim().toLowerCase();
}

export default function LoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!identifier || !password) {
      setError("Fill all fields");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const email = await resolveEmail(identifier);
      const cred = await signInWithEmailAndPassword(
        auth,
        email,
        password.trim(),
      );
      const adminSnap = await getDoc(doc(db, "adminUsers", cred.user.uid));
      const isAdminUser =
        adminSnap.exists() && adminSnap.data()?.role === "admin";

      if (isAdminUser) {
        await signOut(auth);
        setError("Invalid credentials.");
        toast.error("Login failed");
        return;
      }

      await setDoc(
        doc(db, "users", cred.user.uid),
        {
          uid: cred.user.uid,
          email,
          lastLoginAt: serverTimestamp(),
        },
        { merge: true },
      );
      await fetch(`${API_BASE}/api/users/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: cred.user.uid,
          email,
          fullName: cred.user.displayName || null,
          photoUrl: cred.user.photoURL || null,
        }),
      }).catch(() => null);

      toast.success("Login successful");
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "not-found") {
        setError("Phone not registered.");
      } else if (err instanceof FirebaseError) {
        if (err.code === "auth/invalid-credential") {
          setError("Invalid email/phone or password.");
        } else if (err.code === "auth/user-disabled") {
          setError("This account has been disabled.");
        } else if (err.code === "auth/too-many-requests") {
          setError("Too many attempts. Try again later.");
        } else {
          setError("Login failed. Please try again.");
        }
      } else {
        setError("Login failed. Please try again.");
      }

      toast.error("Login failed");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const adminSnap = await getDoc(doc(db, "adminUsers", user.uid));
      const isAdminUser =
        adminSnap.exists() && adminSnap.data()?.role === "admin";

      if (isAdminUser) {
        await signOut(auth);
        setError("Invalid credentials.");
        toast.error("Login failed");
        return;
      }

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        fullName: user.displayName,
        provider: "google",
        lastLoginAt: serverTimestamp(),
      });
      await fetch(`${API_BASE}/api/users/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: user.uid,
          email: user.email,
          fullName: user.displayName || null,
          photoUrl: user.photoURL || null,
        }),
      }).catch(() => null);

      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch {
      toast.error("Google login failed");
    } finally {
      setBusy(false);
    }
  };

  const resetPassword = async () => {
    if (!identifier.includes("@")) {
      setError("Enter email to reset password");
      return;
    }

    await sendPasswordResetEmail(auth, identifier);
    toast.success("Reset email sent");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 flex items-center justify-center px-4 text-slate-100">
      <div className="w-full max-w-5xl grid md:grid-cols-2 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 shadow-2xl shadow-cyan-500/10">
        {/* LEFT PANEL */}
        <div className="relative hidden md:block p-10">
          <div className="absolute -top-12 -left-10 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-12 -right-12 h-52 w-52 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative">
            <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">
              Welcome Back
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight text-white">
              Continue your learning journey with eStudy Hub.
            </h1>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-slate-950/80 p-6 md:p-10">
          <h2 className="text-3xl font-bold text-white">Sign In</h2>
          <p className="mt-2 text-sm text-slate-400">
            Use email or phone number with password.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            {" "}
            {/* EMAIL / PHONE */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                placeholder="Email or phone number"
                className="w-full rounded-xl border border-white/10 bg-slate-900 py-3 pl-10 pr-4 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
            {/* PASSWORD */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full rounded-xl border border-white/10 bg-slate-900 py-3 pl-10 pr-12 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {/* ERROR */}
            {error && (
              <p className="text-sm text-rose-300 bg-rose-500/10 border border-rose-400/30 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}
            {/* LOGIN BUTTON */}
            <button
              disabled={busy}
              className="w-full rounded-xl bg-cyan-400 py-3 text-sm font-semibold text-slate-900 hover:bg-cyan-300 disabled:opacity-60"
            >
              {busy ? (
                <span className="inline-flex items-center gap-2">
                  <FaSpinner className="animate-spin" /> Loading...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* GOOGLE LOGIN */}
          <button
            onClick={handleGoogle}
            disabled={busy}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 py-3 text-sm font-semibold hover:bg-white/10"
          >
            <FaGoogle />
            Continue with Google
          </button>

          {/* RESET PASSWORD */}
          <button
            onClick={resetPassword}
            className="mt-3 text-sm text-cyan-300 hover:text-cyan-200"
          >
            Forgot password?
          </button>

          {/* FOOTER LINKS */}
          <p className="mt-6 text-sm text-slate-400">
            No account?{" "}
            <Link href="/auth/register" className="text-cyan-300 font-semibold">
              Create one
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
