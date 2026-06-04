import type { Metadata } from "next";
import type { ReactNode } from "react";
import AdminLayoutWrapper from "@/components/AdminLayoutWrapper";

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard",
    template: "%s | eStudy Hub",
  },
  description:
    "Admin dashboard for managing eStudy Hub subjects, topics, and quizzes securely.",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
