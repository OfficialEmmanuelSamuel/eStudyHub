"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { FaGraduationCap, FaUser } from "react-icons/fa6";
import { useAuth } from "@/hooks/useAuth";
import LoadingScreen from "@/components/LoadingScreen";
import { db } from "@/lib/firebase";

type ProfileDoc = {
  fullName?: string;
  username?: string;
  bio?: string;
  school?: string;
  level?: string;
  examTrack?: string;
  subjectFocus?: string;
  photoURL?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<ProfileDoc>({});
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      setLoadingProfile(true);
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        setProfile((snap.data() || {}) as ProfileDoc);
      } finally {
        setLoadingProfile(false);
      }
    };
    loadProfile();
  }, [user]);

  if (loading || !user || loadingProfile) {
    return <LoadingScreen message="Loading profile..." />;
  }

  const fullName = profile.fullName || user.displayName || "Student";
  const username = profile.username || user.email?.split("@")[0] || "Not set";
  const photoURL = profile.photoURL || user.photoURL || "";

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-md">
        <p className="text-sm text-emerald-200">Account Settings</p>
        <h1 className="mt-1 text-2xl font-bold md:text-3xl">
          Profile Settings
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-200">
          Update your personal and academic information so your learning
          experience stays tailored to you.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
          {photoURL ? (
            <img
              src={photoURL}
              alt="Profile"
              className="h-20 w-20 rounded-full object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 text-white">
              <FaUser className="text-2xl" />
            </div>
          )}
          <div>
            <p className="text-lg font-semibold text-slate-900">{fullName}</p>
            <p className="text-sm text-slate-500">{user.email || "No email"}</p>
            <button
              type="button"
              onClick={() => router.push("/profile/edit")}
              className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm">
            <p className="text-slate-500">Full name</p>
            <p className="font-medium text-slate-900">{fullName}</p>
          </div>
          <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm">
            <p className="text-slate-500">Username</p>
            <p className="font-medium text-slate-900">{username}</p>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-sm">
          <p className="text-slate-500">Bio</p>
          <p className="font-medium text-slate-900">
            {profile.bio || "No bio added yet."}
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-slate-900">
          <FaGraduationCap className="text-emerald-600" />
          <h2 className="text-lg font-semibold">Academic Info</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm">
            <p className="text-slate-500">School / Institution</p>
            <p className="font-medium text-slate-900">
              {profile.school || "Not set"}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm">
            <p className="text-slate-500">Class / Level</p>
            <p className="font-medium text-slate-900">
              {profile.level || "Not set"}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm">
            <p className="text-slate-500">Exam Track</p>
            <p className="font-medium text-slate-900">
              {profile.examTrack || "Not set"}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm">
            <p className="text-slate-500">Preferred Subject Focus</p>
            <p className="font-medium text-slate-900">
              {profile.subjectFocus || "Not set"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
