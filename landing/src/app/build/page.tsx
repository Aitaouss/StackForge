import { CommandBuilder } from "@/components/command-builder";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { StackForgeChatbot } from "@/components/chatbot/stackforge-chatbot";
import { fetchNpmWeeklyDownloads } from "@/lib/npm-downloads";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build your command — StackForge",
  description:
    "Configure create-stackforge-app options and copy a ready-to-run npx or pnpm dlx command for your stack.",
};

export default async function BuildCommandPage() {
  const npmStats = await fetchNpmWeeklyDownloads();
  const weeklyDownloads = npmStats?.downloads ?? null;

  return (
    <>
      <Navbar weeklyDownloads={weeklyDownloads} />
      <main className="border-t border-white/10 px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <CommandBuilder variant="page" />
        </div>
      </main>
      <Footer />
      <StackForgeChatbot />
    </>
  );
}
