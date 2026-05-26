"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase";
import LoadingScreen from "@/components/LoadingScreen";

export default function SecuritySettingsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [authToggles, setAuthToggles] = useState({
    twoFactor: false,
    emailVerificationAlerts: true,
    loginAlerts: true,
    rememberTrustedDevice: true,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <LoadingScreen message="Loading security settings..." />;
  }

  const handleChangePassword = async (event: FormEvent) => {
    event.preventDefault();

    if (!user.email) {
      toast.error("No email is attached to this account.");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    try {
      setBusy(true);
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast.success("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error(
        "Unable to change password. Confirm your current password and try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleChangeEmail = async (event: FormEvent) => {
    event.preventDefault();

    if (!newEmail.trim()) {
      toast.error("Enter a new email address.");
      return;
    }

    try {
      setBusy(true);
      await verifyBeforeUpdateEmail(
        auth.currentUser!,
        newEmail.trim().toLowerCase(),
      );
      toast.success(
        "Verification email sent to your new address. Confirm it to complete email change.",
      );
      setNewEmail("");
    } catch {
      toast.error("Could not start email change. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-md">
        <p className="text-sm text-emerald-200">Account Protection</p>
        <h1 className="mt-1 text-2xl font-bold md:text-3xl">Auth & Security</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-200">
          Manage password, sign-in safety options, and email security.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Change Password
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Use your current password to authorize a new password change.
        </p>

        <form
          onSubmit={handleChangePassword}
          className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <label className="space-y-1 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">
              Current password
            </span>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-slate-700">
              New password
            </span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-slate-700">
              Confirm new password
            </span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Updating..." : "Change Password"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Sign-in & Verification
        </h2>
        <div className="mt-4 space-y-3">
          {[
            [
              "Two-factor authentication (2FA)",
              "Add extra login verification",
              "twoFactor",
            ],
            [
              "Email verification alerts",
              "Notify me if verification status changes",
              "emailVerificationAlerts",
            ],
            [
              "Login activity alerts",
              "Send alerts for new sign-ins",
              "loginAlerts",
            ],
            [
              "Remember trusted device",
              "Reduce verification prompts on this device",
              "rememberTrustedDevice",
            ],
          ].map(([label, hint, key]) => {
            const typedKey = key as keyof typeof authToggles;
            const enabled = authToggles[typedKey];
            return (
              <div
                key={key}
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{label}</p>
                  <p className="text-xs text-slate-500">{hint}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setAuthToggles((prev) => ({
                      ...prev,
                      [typedKey]: !enabled,
                    }))
                  }
                  className="text-4xl leading-none"
                  aria-pressed={enabled}
                  aria-label={`${label} ${enabled ? "enabled" : "disabled"}`}
                >
                  {enabled ? (
                    <BsToggleOn className="text-emerald-600 transition-colors" />
                  ) : (
                    <BsToggleOff className="text-slate-400 transition-colors" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Change Login Email
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          A verification link will be sent to your new email address.
        </p>
        <form
          onSubmit={handleChangeEmail}
          className="mt-4 flex flex-col gap-3 md:flex-row"
        >
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="new-email@example.com"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Please wait..." : "Update Email"}
          </button>
        </form>
      </section>

      <div>
        <Link
          href="/settings"
          className="text-sm font-semibold text-slate-700 underline underline-offset-2"
        >
          Back to Settings
        </Link>
      </div>
    </div>
  );
}
