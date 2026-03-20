import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "BRRICS — Digital Agency | Design. Build. Scale.",
  description:
    "BRRICS is a futuristic digital agency crafting bold digital experiences through cutting-edge design, development, and strategy.",
  keywords: ["digital agency", "web development", "design", "branding", "BRRICS"],
  openGraph: {
    title: "BRRICS — Digital Agency",
    description: "Design. Build. Scale. — Crafting bold digital experiences.",
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
      className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
    >
      <body className="min-h-screen bg-[#030303] text-[#f0f0f0] font-sans">
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}