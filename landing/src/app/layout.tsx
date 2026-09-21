import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const gaId = process.env.NEXT_PUBLIC_GA_ID;

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://stack-forge.aitaouss.me";

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
  metadataBase: new URL(siteUrl),
  title: "StackForge — create-stackforge-app",
  description:
    "Production-ready CLI to scaffold Next.js, NestJS, shared Zod contracts, Prisma, Tailwind, shadcn/ui, JWT auth, and Docker in seconds.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "StackForge — Ship full-stack apps in seconds",
    description:
      "npx create-stackforge-app@latest — monorepo scaffolding with shared Zod contracts, presets, and Docker.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StackForge — create-stackforge-app",
    description:
      "Scaffold Next.js, NestJS, Prisma, shared contracts, and production Docker in one command.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        {children}
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}
