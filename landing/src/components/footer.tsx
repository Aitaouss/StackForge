import { Anvil } from "lucide-react";
import Link from "next/link";
import { TrackedGitHubLink } from "./tracked-github-link";
import { TrackedNpmLink } from "./tracked-npm-link";
import { CLI_VERSION } from "@/data/product";
import { Reveal } from "@/components/motion/reveal";

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-12 sm:px-6">
      <Reveal className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-zinc-100">
            <Anvil className="h-5 w-5 text-emerald-400" aria-hidden />
            <span className="font-semibold">StackForge</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-zinc-500">
            MIT License · create-stackforge-app v{CLI_VERSION} · Scaffold production full-stack apps
            with Next.js, NestJS, Prisma, Docker, and CI templates.
          </p>
        </div>
        <nav className="flex flex-col gap-2 text-sm" aria-label="Footer">
          <TrackedNpmLink source="footer" className="text-zinc-400 hover:text-emerald-300">
            npm package
          </TrackedNpmLink>
          <TrackedGitHubLink source="footer" className="text-zinc-400 hover:text-emerald-300">
            Source on GitHub
          </TrackedGitHubLink>
          <Link href="/docs" className="text-zinc-400 hover:text-emerald-300">
            Documentation
          </Link>
          <Link href="/contributing" className="text-zinc-400 hover:text-emerald-300">
            Contributing
          </Link>
        </nav>
      </Reveal>
      <Reveal delay={0.08} className="mx-auto mt-10 max-w-6xl space-y-2 text-center text-xs">
        <p className="text-zinc-400">© 2026 Aimen Taoussi. All rights reserved.</p>
        <p className="text-zinc-400">
          Generated projects require Node.js ≥18. Use corepack to enable pnpm before install.
        </p>
      </Reveal>
    </footer>
  );
}
