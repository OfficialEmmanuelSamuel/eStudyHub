import type { Metadata } from "next";
import { AdminAuthProvider } from "@/context/AdminAuthProvider";

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard",
    template: "%s | eStudy Hub",
  },
  description:
    "Admin dashboard for managing eStudy Hub subjects, topics, and quizzes securely.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}
