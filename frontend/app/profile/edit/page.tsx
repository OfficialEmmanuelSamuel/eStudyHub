"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { FaCamera, FaGraduationCap, FaSpinner, FaUser } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { db, storage } from "@/lib/firebase";

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

export default function EditProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [school, setSchool] = useState("");
  const [level, setLevel] = useState("");
  const [examTrack, setExamTrack] = useState("");
  const [subjectFocus, setSubjectFocus] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
        const profileSnap = await getDoc(doc(db, "users", user.uid));
        const profile = (profileSnap.data() || {}) as ProfileDoc;
        setFullName(profile.fullName || user.displayName || "");
        setUsername(profile.username || user.email?.split("@")[0] || "");
        setBio(profile.bio || "");
        setSchool(profile.school || "");
        setLevel(profile.level || "");
        setExamTrack(profile.examTrack || "");
        setSubjectFocus(profile.subjectFocus || "");
        setPhotoURL(profile.photoURL || user.photoURL || "");
      } catch {
        toast.error("Could not load profile data.");
      } finally {
        setLoadingProfile(false);
      }
    };
    loadProfile();
  }, [user]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      setPhotoURL(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setBusy(true);
    try {
      let finalPhotoURL = user.photoURL || "";

      if (selectedFile) {
        const ext = selectedFile.name.split(".").pop() || "jpg";
        const imageRef = ref(storage, `profilePictures/${user.uid}/avatar.${ext}`);
        await uploadBytes(imageRef, selectedFile, { contentType: selectedFile.type });
        finalPhotoURL = await getDownloadURL(imageRef);
      } else if (photoURL) {
        finalPhotoURL = photoURL;
      }

      await updateProfile(user, {
        displayName: fullName.trim() || "Student",
        photoURL: finalPhotoURL || null,
      });

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email || "",
          fullName: fullName.trim(),
          username: username.trim().toLowerCase(),
          bio: bio.trim(),
          school: school.trim(),
          level: level.trim(),
          examTrack: examTrack.trim(),
          subjectFocus: subjectFocus.trim(),
          photoURL: finalPhotoURL || "",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      toast.success("Profile updated successfully.");
      router.push("/profile");
    } catch {
      toast.error("Failed to save profile. Check Firebase rules for Firestore/Storage.");
    } finally {
      setBusy(false);
    }
  };

  if (loading || !user || loadingProfile) {
    return <p className="text-sm text-slate-600">Loading profile editor...</p>;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-md">
        <p className="text-sm text-emerald-200">Account Settings</p>
        <h1 className="mt-1 text-2xl font-bold md:text-3xl">Edit Profile</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-200">Update your personal and academic information.</p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            {photoURL ? (
              <img src={photoURL} alt="Profile" className="h-20 w-20 rounded-full object-cover shadow-sm" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 text-white">
                <FaUser className="text-2xl" />
              </div>
            )}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-cyan-300">
              <FaCamera />
              Change profile picture
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-slate-600">Full name</span>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-400"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-slate-600">Username</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-400"
              />
            </label>
          </div>

          <label className="mt-4 block space-y-1 text-sm">
            <span className="text-slate-600">Bio</span>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about your learning goals..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-400"
            />
          </label>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-slate-900">
            <FaGraduationCap className="text-emerald-600" />
            <h2 className="text-lg font-semibold">Academic Info</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="School / Institution"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-400"
            />
            <input
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="Class / Level"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-400"
            />
            <input
              value={examTrack}
              onChange={(e) => setExamTrack(e.target.value)}
              placeholder="Exam Track (WAEC, JAMB, etc.)"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-400"
            />
            <input
              value={subjectFocus}
              onChange={(e) => setSubjectFocus(e.target.value)}
              placeholder="Preferred Subject Focus"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-400"
            />
          </div>
          <div className="mt-5 flex gap-3">
            <button
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
            >
              {busy ? <FaSpinner className="animate-spin" /> : null}
              Save Profile Changes
            </button>
            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}

