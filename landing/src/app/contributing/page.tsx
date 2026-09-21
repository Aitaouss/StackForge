import { CommandBlock } from "@/components/command-block";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { StackForgeChatbot } from "@/components/chatbot/stackforge-chatbot";
import { contributingSections } from "@/data/contributing";
import { fetchNpmWeeklyDownloads } from "@/lib/npm-downloads";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contributing — StackForge",
  description: "How to develop the create-stackforge-app CLI and the StackForge landing site.",
};

export default async function ContributingPage() {
  const npmStats = await fetchNpmWeeklyDownloads();
  const weeklyDownloads = npmStats?.downloads ?? null;

  return (
    <>
      <Navbar weeklyDownloads={weeklyDownloads} />
      <main className="border-t border-white/10 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-12">
          <header>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
              Contributing
            </h1>
            <p className="mt-4 text-zinc-400">
              Maintainer notes for the CLI and landing site. Product users should start with{" "}
              <Link href="/docs" className="text-emerald-400 underline underline-offset-2">
                documentation
              </Link>
              .
            </p>
          </header>

          {contributingSections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="text-xl font-semibold text-zinc-100">{section.title}</h2>
              {section.paragraphs?.map((p) => (
                <p key={p} className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {p}
                </p>
              ))}
              {section.commands?.map((cmd) => (
                <div key={cmd} className="mt-4">
                  <CommandBlock command={cmd} />
                </div>
              ))}
              {section.list ? (
                <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-zinc-400">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </main>
      <Footer />
      <StackForgeChatbot />
    </>
  );
}
