import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { AuthProvider } from "@/context/AuthProvider";
import ToasterProvider from "@/components/ToasterProvider";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "eStudy Hub",
    template: "%s | eStudy Hub",
  },
  description:
    "eStudy Hub helps students learn with adaptive quizzes, progress tracking, and AI-powered guidance for exam preparation.",
  keywords: [
    "eStudy Hub",
    "study planner",
    "quiz practice",
    "AI tutor",
    "student dashboard",
    "exam prep",
  ],
  authors: [{ name: "eStudy Hub" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "eStudy Hub",
    description:
      "eStudy Hub helps students learn with adaptive quizzes, progress tracking, and AI-powered guidance for exam preparation.",
    type: "website",
    locale: "en_US",
    siteName: "eStudy Hub",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${quicksand.variable} h-full antialiased`}
    >
      <body className={`${quicksand.className} bg-gray-100 min-h-full`}>
        <AuthProvider>
          <ToasterProvider />
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
