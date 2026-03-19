import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE_NAME } from "./lib/constants";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: "A paywalled blog demo powered by Next.js, Sanity, Stripe, and ThirdWeb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {/* Navigation */}
        <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="font-[family-name:var(--font-title)] text-xl font-bold tracking-tight text-gray-900"
            >
              {SITE_NAME}
            </Link>
            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/demo"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Demo
              </Link>
              <Link
                href="/studio"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Studio
              </Link>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
          {SITE_NAME} — A demo of paywalled content with Next.js, Sanity, Stripe &amp; ThirdWeb
        </footer>
      </body>
    </html>
  );
}
