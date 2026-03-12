import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mon Online Library",
  description: "A public digital library for Mon language and learning resources.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        {/* Navbar */}
        <nav className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
            <Link href="/" className="text-lg font-semibold">
              Mon Online Library
            </Link>

            <div className="flex items-center gap-6 text-sm">
              <Link href="/" className="hover:underline">
                Home
              </Link>

              <Link href="/library" className="hover:underline">
                Library
              </Link>
            </div>
          </div>
        </nav>

        {/* Page content */}
        <main className="mx-auto max-w-6xl px-6 pt-12 pb-16">
          {children}
        </main>
      </body>
    </html>
  );
}
