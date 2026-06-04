"use client";

import Image from "next/image";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  FaBars,
  FaMagnifyingGlass,
  FaRightFromBracket,
  FaUser,
} from "react-icons/fa6";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

type NavbarProps = {
  onMenuClick: () => void;
  mobileOpen: boolean;
};

export default function Navbar({ onMenuClick, mobileOpen }: NavbarProps) {
  const router = useRouter();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/auth/login");
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-30 bg-white/95 px-4 py-3 shadow-slate-200 backdrop-blur md:left-72 md:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-4 md:gap-8">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 md:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-sidebar"
          >
            <FaBars />
          </button>
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              width={36}
              height={36}
              alt="eStudy Hub logo"
              className="h-9 w-9 rounded-lg object-contain"
            />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                eStudy Hub
              </h2>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                Learning Workspace
              </p>
            </div>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 lg:flex">
          <FaMagnifyingGlass className="text-slate-400" />
          <input
            placeholder="Search topics"
            suppressHydrationWarning
            className="w-100 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 md:hidden"
            aria-label="Open profile"
          >
            <FaUser />
          </button>

          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left transition-colors hover:bg-slate-100 md:flex"
          >
            <FaUser className="text-emerald-600" />
            <p className="max-w-44 truncate text-sm font-medium text-slate-700">
              {user?.displayName || user?.email || "Student"}
            </p>
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-700"
          >
            <FaRightFromBracket />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
