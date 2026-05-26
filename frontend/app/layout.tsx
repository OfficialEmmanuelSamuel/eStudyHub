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
  title: "StudyHub",
  description: "StudyHub dashboard",
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
