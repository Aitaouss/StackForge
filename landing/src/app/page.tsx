import { Architecture } from "@/components/architecture";
import { CliFlags } from "@/components/cli-flags";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { StackForgeChatbot } from "@/components/chatbot/stackforge-chatbot";
import { UsageDocs } from "@/components/usage-docs";
import { fetchNpmWeeklyDownloads } from "@/lib/npm-downloads";

export default async function HomePage() {
  const npmStats = await fetchNpmWeeklyDownloads();
  const weeklyDownloads = npmStats?.downloads ?? null;

  return (
    <>
      <Navbar weeklyDownloads={weeklyDownloads} />
      <main>
        <Hero weeklyDownloads={weeklyDownloads} />
        <Features />
        <Architecture />
        <CliFlags />
        <UsageDocs />
      </main>
      <Footer />
      <StackForgeChatbot />
    </>
  );
}
