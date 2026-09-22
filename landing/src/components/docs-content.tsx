import Link from "next/link";
import { documentationSections } from "@/data/documentation";
import { CommandBlock } from "./command-block";

export function DocsContent() {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[220px_1fr]">
      <nav
        className="myscroll hidden lg:block lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto"
        aria-label="Documentation sections"
      >
        <ul className="space-y-1 border-l border-white/10 pl-4 text-sm">
          {documentationSections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="block py-1 text-zinc-500 transition hover:text-emerald-300"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="min-w-0 space-y-14">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Documentation
          </h1>
          <p className="mt-4 max-w-2xl text-zinc-400">
            Official guide for the create-stackforge-app CLI and generated monorepos. Maintainers:{" "}
            <a href="/contributing" className="text-emerald-400 underline underline-offset-2">
              contributing
            </a>
            . Prefer a visual picker?{" "}
            <Link href="/build" className="text-emerald-400 underline underline-offset-2">
              Build your command
            </Link>
            .
          </p>
        </header>

        {documentationSections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <h2 className="text-xl font-semibold text-zinc-100">{section.title}</h2>
            {section.paragraphs?.map((p) => (
              <p key={p} className="mt-3 text-sm leading-relaxed text-zinc-400">
                {p}
              </p>
            ))}
            {section.list && (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-400">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {section.commands?.map((cmd) => (
              <div key={cmd} className="mt-4">
                {cmd.includes("\n") && !cmd.startsWith("npx") && !cmd.startsWith("cd") ? (
                  <pre className="myscroll overflow-x-auto rounded-xl border border-white/10 bg-zinc-950 p-4 font-mono text-xs text-emerald-200/90 sm:text-sm">
                    {cmd}
                  </pre>
                ) : (
                  <CommandBlock command={cmd} variant="bar" />
                )}
              </div>
            ))}
            {section.table && (
              <div className="myscroll mt-4 overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="bg-zinc-900/80 text-zinc-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">Flag</th>
                      <th className="px-4 py-3 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {section.table.map((row) => (
                      <tr key={row.flag} className="bg-zinc-950/50">
                        <td className="px-4 py-3 font-mono text-xs text-emerald-300 sm:text-sm">
                          {row.flag}
                        </td>
                        <td className="px-4 py-3 text-zinc-400">{row.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
