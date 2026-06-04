"use client";

import Image from "next/image";
import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaBell,
  FaBookOpen,
  FaChartLine,
  FaCirclePlus,
  FaCommentDots,
  FaGear,
  FaHouse,
  FaRightFromBracket,
  FaTag,
  FaXmark,
} from "react-icons/fa6";
import { useAdminAuth } from "@/context/AdminAuthProvider";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

type AdminSidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: FaHouse },
  { href: "/admin", label: "Dashboard", icon: FaChartLine },
  { href: "/admin/add-subject", label: "Add Subject", icon: FaBookOpen },
  { href: "/admin/add-topics", label: "Add Topic", icon: FaTag },
  { href: "/admin/add-quiz", label: "Add Quizes", icon: FaCirclePlus },
  { href: "/admin/notifications", label: "Notifications", icon: FaBell },
  {
    href: "/admin/messages",
    label: "Complaint / Messages",
    icon: FaCommentDots,
  },
  { href: "/admin/settings", label: "Settings", icon: FaGear },
];

export default function AdminSidebar({
  mobileOpen = false,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { adminData, logout } = useAdminAuth();
  const displayName = adminData?.fullName || "Admin";

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      router.replace("/admin/login");
    }
  };

  return (
    <>
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-slate-200 bg-slate-950 px-5 py-6 text-slate-100 md:block">
        <div className="flex h-full flex-col">
          <div className="mb-10 flex flex-col items-center text-center">
            <Image
              src="/logo.png"
              width={72}
              height={72}
              alt="eStudy Hub admin logo"
              className="mb-3 rounded-full border border-slate-700 bg-slate-800 object-contain p-2"
            />
            <p className="text-sm font-semibold text-white">{displayName}</p>
            <p className="text-xs text-slate-400">Admin Portal</p>
          </div>

          <nav className="space-y-2 overflow-y-auto pr-1">
            {navItems.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-150 ${
                    active
                      ? "bg-slate-800 text-white shadow-lg shadow-slate-900/40"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="text-base" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-500"
            >
              <FaRightFromBracket className="text-base" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div
        className={`fixed inset-0 z-40 bg-slate-950/65 transition-opacity duration-300 md:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        id="admin-mobile-sidebar"
        aria-hidden={!mobileOpen}
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col overflow-y-auto border-r border-slate-800 bg-slate-950 px-5 py-6 transition-transform duration-300 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              width={52}
              height={52}
              alt="eStudy Hub admin logo"
              className="rounded-full border border-slate-700 bg-slate-800 object-contain p-1"
            />
            <div>
              <p className="text-sm font-semibold text-white">{displayName}</p>
              <p className="text-xs text-slate-400">Admin Portal</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 transition hover:bg-slate-800"
          >
            <FaXmark />
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-150 ${
                  active
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="text-base" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6">
          <button
            type="button"
            onClick={async () => {
              const success = await logout();
              onClose?.();
              if (success) {
                router.replace("/admin/login");
              }
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-500"
          >
            <FaRightFromBracket className="text-base" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
