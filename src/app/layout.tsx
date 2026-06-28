import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Code Constellation Internships — Build Something Real in 15 Days",
  description:
    "Join a project-based internship program. Pick your track — Frontend, AI/ML, UI/UX, Content, Video, or Lead Gen — build a real project in 15 days, and get certified. We Build It. You Just Present It.",
  keywords: [
    "internship",
    "code constellation",
    "project-based learning",
    "frontend",
    "AI",
    "ML",
    "UI/UX",
    "certificate",
  ],
  openGraph: {
    title: "Code Constellation Internships",
    description: "Build something real in 15 days. Project-based internship program.",
    url: "https://codeconstellation.in",
    siteName: "Code Constellation",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-bg-white)]">
        <ScrollProgress />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
