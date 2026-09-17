import { DocsContent } from "@/components/docs-content";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { StackForgeChatbot } from "@/components/chatbot/stackforge-chatbot";
import { fetchNpmWeeklyDownloads } from "@/lib/npm-downloads";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation — StackForge",
  description:
    "How to use create-stackforge-app: CLI flags, generated project structure, pnpm, Docker, and troubleshooting.",
};

export default async function DocsPage() {
  const npmStats = await fetchNpmWeeklyDownloads();
  const weeklyDownloads = npmStats?.downloads ?? null;

  return (
    <>
      <Navbar weeklyDownloads={weeklyDownloads} />
      <main className="border-t border-white/10 px-4 py-16 sm:px-6 sm:py-20">
        <DocsContent />
      </main>
      <Footer />
      <StackForgeChatbot />
    </>
  );
}
