import { Anvil } from "lucide-react";
import Link from "next/link";

const NPM_URL = "https://www.npmjs.com/package/create-stackforge-app";
const GITHUB_URL = "https://github.com/Aitaouss/StackForge";

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-zinc-100">
            <Anvil className="h-5 w-5 text-emerald-400" aria-hidden />
            <span className="font-semibold">StackForge</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-zinc-500">
            MIT License · create-stackforge-app v1.0.8 · Scaffold production full-stack apps with
            Next.js, NestJS, and Prisma.
          </p>
        </div>
        <nav className="flex flex-col gap-2 text-sm" aria-label="Footer">
          <Link href={NPM_URL} className="text-zinc-400 hover:text-emerald-300">
            npm package
          </Link>
          <Link href={GITHUB_URL} className="text-zinc-400 hover:text-emerald-300">
            Source on GitHub
          </Link>
          <Link href="/docs" className="text-zinc-400 hover:text-emerald-300">
            Documentation
          </Link>
        </nav>
      </div>
      <div className="mx-auto mt-10 max-w-6xl space-y-2 text-center text-xs">
        <p className="text-zinc-400">© 2026 Aimen Taoussi. All rights reserved.</p>
        <p className="text-zinc-400">
          Generated projects require Node.js ≥18. Use corepack to enable pnpm before install.
        </p>
      </div>
    </footer>
  );
}
