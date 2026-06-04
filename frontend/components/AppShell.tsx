"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mainRef = useRef<HTMLElement | null>(null);
  const hideShell =
    pathname === "/landing" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/admin");

  useEffect(() => {
    window.scrollTo(0, 0);
    mainRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileMenuOpen]);

  if (hideShell) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden md:ml-72">
        <Navbar
          onMenuClick={() => setMobileMenuOpen(true)}
          mobileOpen={mobileMenuOpen}
        />
        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto p-4 pt-24 md:p-6 md:pt-24"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
