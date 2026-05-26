"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaBell,
  FaBookOpen,
  FaBrain,
  FaCalendarDays,
  FaChartLine,
  FaClipboardCheck,
  FaGear,
  FaUser,
  FaUsers,
  FaHouse,
} from "react-icons/fa6";
import { useAuth } from "@/hooks/useAuth";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: FaHouse },
  { href: "/dashboard", label: "Dashboard", icon: FaChartLine },
  { href: "/subjects", label: "Subjects", icon: FaBookOpen },
  { href: "/my-subjects", label: "My Subjects", icon: FaBookOpen },
  { href: "/quiz", label: "Quizzes", icon: FaClipboardCheck },
  { href: "/study-planner", label: "Study Planner", icon: FaCalendarDays },
  { href: "/ai-tutor", label: "AI Tutor", icon: FaBrain },
  { href: "/learning-group", label: "Community", icon: FaUsers },
  { href: "/notifications", label: "Notifications", icon: FaBell },
  { href: "/profile", label: "Profile", icon: FaUser },
  { href: "/settings", label: "Settings", icon: FaGear },
];

type SidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const fullName =
    user?.displayName?.trim() ||
    (user?.email ? user.email.split("@")[0] : "Student");

  return (
    <>
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-72 bg-white px-5 py-6 shadow-lg shadow-gray-100 md:block">
        <div className="flex h-full min-h-0 flex-col">
          <div className="p-4">
            <div className="flex flex-col items-center text-center">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={fullName}
                  className="h-16 w-16 rounded-full border-2 border-white object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-slate-300 via-slate-300 to-slate-300 text-xl text-slate-900 shadow-sm">
                  <FaUser />
                </div>
              )}
              <p className="mt-3 text-sm font-semibold text-slate-900">
                {fullName}
              </p>
            </div>
          </div>

          <nav className="mt-6 flex-1 space-y-1 overflow-y-auto pr-1">
            {navItems.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="text-base" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <div
        className={`fixed inset-0 z-40 bg-slate-950/45 transition-opacity duration-300 md:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col overflow-y-auto border-r border-slate-200 bg-white px-5 py-6 transition-transform duration-300 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="flex flex-col items-center text-center">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={fullName}
                className="h-16 w-16 rounded-full border-2 border-white object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-slate-300 via-slate-300 to-slate-300 text-xl text-slate-900 shadow-sm">
                <FaUser />
              </div>
            )}
            <p className="mt-3 text-sm font-semibold text-slate-900">{fullName}</p>
          </div>
        </div>

        <nav className="mt-6 flex-1 space-y-1">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="text-base" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
