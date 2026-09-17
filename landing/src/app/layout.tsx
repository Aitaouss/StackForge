import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StackForge — create-stackforge-app",
  description:
    "Production-ready CLI to scaffold Next.js, NestJS, Prisma, Tailwind, shadcn/ui, JWT auth, and Docker in seconds.",
  openGraph: {
    title: "StackForge — Ship full-stack apps in seconds",
    description:
      "npx create-stackforge-app@latest — opinionated full-stack monorepo scaffolding.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
