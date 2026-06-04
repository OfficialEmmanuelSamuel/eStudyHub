"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FaBars } from "react-icons/fa6";
import { AdminAuthProvider } from "@/context/AdminAuthProvider";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayoutWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const hideSidebar =
    pathname === "/admin/login" || pathname === "/admin/register";

  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-slate-100">
        {!hideSidebar && (
          <>
            <AdminSidebar
              mobileOpen={mobileOpen}
              onClose={() => setMobileOpen(false)}
            />
            <div className="fixed inset-x-0 top-0 z-40 bg-slate-950/95 border-b border-slate-900/60 px-4 py-3 text-white md:hidden">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open admin menu"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 transition hover:bg-slate-800"
                >
                  <FaBars className="text-base" />
                </button>
                <div className="text-sm font-semibold">Admin Menu</div>
                <div className="w-10" />
              </div>
            </div>
          </>
        )}
        <main
          className={hideSidebar ? "min-h-screen" : "min-h-screen md:ml-72"}
        >
          {!hideSidebar && <div className="h-16 md:hidden" />}
          {children}
        </main>
      </div>
    </AdminAuthProvider>
  );
}
