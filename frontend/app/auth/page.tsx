"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
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
} from "react-icons/fa";
import toast from "react-hot-toast";
import { auth, db, googleProvider } from "@/lib/firebase";
import { API_BASE } from "@/lib/apiBase";

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !phone || !password || !confirmPassword) {
      setError("Please fill out all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setPasswordMismatch(true);
      return;
    }

    setBusy(true);
    setError("");

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );

      const user = userCred.user;

      await updateProfile(user, { displayName: name });

      const normalizedEmail = email.trim().toLowerCase();
      const digits = phone.replace(/[^\d]/g, "");

      // MAIN USER PROFILE
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        phoneDigits: digits,
        provider: "password",
        role: "student",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      });
      await fetch(`${API_BASE}/api/users/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: user.uid,
          email: normalizedEmail,
          fullName: name.trim(),
          photoUrl: user.photoURL || null,
        }),
      }).catch(() => null);

      // EMAIL INDEX
      await setDoc(doc(db, "usersByEmail", normalizedEmail), {
        uid: user.uid,
        email: normalizedEmail,
        role: "student",
        updatedAt: serverTimestamp(),
      });

      // PHONE INDEX
      if (digits) {
        await setDoc(doc(db, "phoneIndex", digits), {
          uid: user.uid,
          email: normalizedEmail,
          updatedAt: serverTimestamp(),
        });
      }

      toast.success("Registration successful!");
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error(err);

      if (
        err &&
        typeof err === "object" &&
        "code" in err &&
        err.code === "auth/email-already-in-use"
      ) {
        setError("Email already in use.");
        toast.error("Email already exists.");
      } else if (
        err &&
        typeof err === "object" &&
        "code" in err &&
        err.code === "auth/unauthorized-domain"
      ) {
        setError(`Add ${hostForFirebaseAllowlist()} to Firebase authorized domains.`);
      } else {
        setError("Registration failed. Try again.");
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
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const normalizedEmail = user.email?.toLowerCase() || "";

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: user.displayName || "",
        email: normalizedEmail,
        provider: "google",
        role: "student",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      });
      await fetch(`${API_BASE}/api/users/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: user.uid,
          email: normalizedEmail,
          fullName: user.displayName || "",
          photoUrl: user.photoURL || null,
        }),
      }).catch(() => null);

      if (normalizedEmail) {
        await setDoc(doc(db, "usersByEmail", normalizedEmail), {
          uid: user.uid,
          email: normalizedEmail,
          role: "student",
          updatedAt: serverTimestamp(),
        });
      }

      toast.success("Google signup successful!");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Google signup failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <div className="w-full max-w-2xl p-8">
        <h1 className="text-3xl font-bold">Register</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            placeholder="Full name"
            className="w-full p-3 bg-slate-900 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Email"
            className="w-full p-3 bg-slate-900 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Phone"
            className="w-full p-3 bg-slate-900 rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-slate-900 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 bg-slate-900 rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && <p className="text-red-400">{error}</p>}

          <button
            disabled={busy}
            className="w-full bg-cyan-400 text-black py-3 rounded"
          >
            {busy ? "Loading..." : "Create Account"}
          </button>
        </form>

        <button
          onClick={handleGoogle}
          disabled={busy}
          className="w-full mt-4 border py-3 rounded"
        >
          Continue with Google
        </button>

        <p className="mt-4 text-sm">
          Already have account? <Link href="/auth/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
