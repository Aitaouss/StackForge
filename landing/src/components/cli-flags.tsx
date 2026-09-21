import { CommandBlock } from "./command-block";
import { Reveal } from "@/components/motion/reveal";

const FLAGS = [
  { flag: "-y, --yes", desc: "Skip all prompts and use defaults (PostgreSQL, Docker, auto-install)" },
  { flag: "-d, --database <type>", desc: "Database: postgresql or sqlite" },
  { flag: "--docker / --no-docker", desc: "Generate or skip Docker support" },
  { flag: "--install / --no-install", desc: "Install dependencies automatically or skip" },
  { flag: "-c, --cwd <path>", desc: "Working directory for project output" },
] as const;

const EXAMPLES = [
  "npx create-stackforge-app@latest my-app -y",
  "npx create-stackforge-app@latest my-app -y --database sqlite --no-docker --no-install",
];

export function CliFlags() {
  return (
    <section id="cli" className="border-t border-white/10 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            CLI flags & automation
          </h2>
          <p className="mt-4 text-zinc-400">
            Use interactive prompts locally, or pass flags in CI and scripts for repeatable scaffolds.
          </p>
        </Reveal>

        <Reveal delay={0.1} y={20}>
          <div className="mt-10 overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900/80 text-zinc-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Flag</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {FLAGS.map((row) => (
                  <tr key={row.flag} className="bg-zinc-950/50 transition hover:bg-zinc-900/40">
                    <td className="px-4 py-3 font-mono text-xs text-emerald-300 sm:text-sm">
                      {row.flag}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-10 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Examples</h3>
          {EXAMPLES.map((cmd) => (
            <CommandBlock key={cmd} command={cmd} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
