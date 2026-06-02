import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "Student Proof-of-Work",
    template: "%s | Student Proof-of-Work",
  },
  description:
    "Build a recruiter-friendly student profile with projects, proofs, wallet connection, and public sharing.",
  metadataBase: new URL("https://student-proof-of-work.vercel.app"),
  openGraph: {
    title: "Student Proof-of-Work",
    description:
      "Show recruiters what you have actually built with a public proof-of-work profile.",
    url: "https://student-proof-of-work.vercel.app",
    siteName: "Student Proof-of-Work",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Proof-of-Work",
    description:
      "Show recruiters what you have actually built with a public proof-of-work profile.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster richColors closeButton position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
