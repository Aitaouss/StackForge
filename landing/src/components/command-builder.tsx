"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { CLI_VERSION } from "@/data/product";
import {
  BUILDER_DEFAULTS,
  buildCreateCommand,
  buildCreateCommandParts,
  presetSummary,
  YES_MODE_DEFAULTS,
  type Database,
  type Preset,
  type Runner,
} from "@/lib/build-create-command";
import { buildScaffoldSteps } from "@/lib/build-scaffold-steps";
import { cn } from "@/lib/utils";
import { CommandBlock } from "./command-block";
import { ConfigSummaryBadges } from "./config-summary-badges";
import { ScaffoldStepList } from "./scaffold-step-list";
import { SegmentedControl } from "./segmented-control";
import { TooltipProvider } from "./ui/tooltip";

type ScaffoldMode = "wizard" | "flags";

type CommandBuilderProps = {
  className?: string;
  id?: string;
  variant?: "page" | "embedded";
};

export function CommandBuilder({
  className,
  id = "command-builder",
  variant = "embedded",
}: CommandBuilderProps) {
  const [runner, setRunner] = useState<Runner>(BUILDER_DEFAULTS.runner);
  const [pinVersion, setPinVersion] = useState(BUILDER_DEFAULTS.pinVersion);
  const [projectName, setProjectName] = useState(BUILDER_DEFAULTS.projectName);
  const [scaffoldMode, setScaffoldMode] = useState<ScaffoldMode>(BUILDER_DEFAULTS.scaffoldMode);
  const skipPrompts = scaffoldMode === "flags";
  const [preset, setPreset] = useState<Preset>(BUILDER_DEFAULTS.preset);
  const [database, setDatabase] = useState<Database>(BUILDER_DEFAULTS.database);
  const [docker, setDocker] = useState(BUILDER_DEFAULTS.docker);
  const [install, setInstall] = useState(BUILDER_DEFAULTS.install);
  const [cwd, setCwd] = useState(BUILDER_DEFAULTS.cwd);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const options = useMemo(
    () => ({
      runner,
      pinVersion,
      projectName,
      skipPrompts,
      preset,
      database,
      docker,
      install,
      cwd,
    }),
    [runner, pinVersion, projectName, skipPrompts, preset, database, docker, install, cwd],
  );

  const command = useMemo(
    () => buildCreateCommand(options, CLI_VERSION),
    [options],
  );

  const commandParts = useMemo(
    () => buildCreateCommandParts(options, CLI_VERSION),
    [options],
  );

  const scaffoldSteps = useMemo(
    () => buildScaffoldSteps({ skipPrompts, install, database, docker }),
    [skipPrompts, install, database, docker],
  );

  const usesDefaults =
    skipPrompts &&
    preset === YES_MODE_DEFAULTS.preset &&
    database === YES_MODE_DEFAULTS.database &&
    docker === YES_MODE_DEFAULTS.docker &&
    install === YES_MODE_DEFAULTS.install &&
    !cwd.trim();

  const isFullyDefault =
    runner === BUILDER_DEFAULTS.runner &&
    pinVersion === BUILDER_DEFAULTS.pinVersion &&
    projectName === BUILDER_DEFAULTS.projectName &&
    scaffoldMode === BUILDER_DEFAULTS.scaffoldMode &&
    preset === BUILDER_DEFAULTS.preset &&
    database === BUILDER_DEFAULTS.database &&
    docker === BUILDER_DEFAULTS.docker &&
    install === BUILDER_DEFAULTS.install &&
    cwd === BUILDER_DEFAULTS.cwd;

  const resetDefaults = useCallback(() => {
    setRunner(BUILDER_DEFAULTS.runner);
    setPinVersion(BUILDER_DEFAULTS.pinVersion);
    setProjectName(BUILDER_DEFAULTS.projectName);
    setScaffoldMode(BUILDER_DEFAULTS.scaffoldMode);
    setPreset(BUILDER_DEFAULTS.preset);
    setDatabase(BUILDER_DEFAULTS.database);
    setDocker(BUILDER_DEFAULTS.docker);
    setInstall(BUILDER_DEFAULTS.install);
    setCwd(BUILDER_DEFAULTS.cwd);
    setAdvancedOpen(false);
  }, []);

  const commandHeader = (
    <>
      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400/90">
        Live command
      </span>
      {usesDefaults && (
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
          Default configuration applied
        </span>
      )}
    </>
  );

  return (
    <TooltipProvider delayDuration={200}>
    <section id={id} className={cn("scroll-mt-24", className)}>
      <div className="glass overflow-hidden rounded-2xl border border-white/10">
        {variant === "page" && (
          <div className="border-b border-white/10 bg-zinc-950/40 px-5 py-5 sm:px-7 sm:py-6">
            <p className="text-sm font-medium text-emerald-400/90">create-stackforge-app</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
              Build your command
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
              Pick options — the command updates live.{" "}
              <Link
                href="/docs#cli-flags"
                className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
              >
                Flag reference
              </Link>
            </p>
          </div>
        )}

        {variant === "embedded" && (
          <div className="border-b border-white/10 px-5 py-4 sm:px-7">
            <h2 className="text-xl font-semibold text-zinc-50">Build your command</h2>
            <p className="mt-1 text-sm text-zinc-400">
              <Link href="/build" className="text-emerald-400 underline underline-offset-2">
                Open full builder
              </Link>
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-[minmax(0,11fr)_minmax(0,13fr)]">
          <div className="order-1 space-y-4 border-b border-white/10 bg-zinc-950/20 p-5 sm:p-6 lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-zinc-200">Configure scaffold</h2>
              <button
                type="button"
                onClick={resetDefaults}
                disabled={isFullyDefault}
                className="text-xs font-medium text-zinc-500 transition hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-zinc-500"
              >
                Reset defaults
              </button>
            </div>

            <SegmentedControl
              label="Scaffold mode"
              value={scaffoldMode}
              onChange={setScaffoldMode}
              options={[
                { value: "flags", label: "Fast flags (-y)" },
                { value: "wizard", label: "Interactive wizard" },
              ]}
            />

            <label className="block space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Project name
              </span>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                className="w-full rounded-lg border border-white/10 bg-zinc-950/80 px-3 py-2 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                placeholder="my-app"
              />
            </label>

            <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
              <SegmentedControl
                label="Run with"
                value={runner}
                onChange={setRunner}
                options={[
                  { value: "npx", label: "npx" },
                  { value: "pnpm", label: "pnpm dlx" },
                ]}
              />
              <SegmentedControl
                label="CLI version"
                value={pinVersion ? "pinned" : "latest"}
                onChange={(v) => setPinVersion(v === "pinned")}
                options={[
                  { value: "pinned", label: CLI_VERSION },
                  { value: "latest", label: "latest" },
                ]}
              />
            </div>

            {skipPrompts && (
              <>
                <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
                  <SegmentedControl
                    label="Database"
                    value={database}
                    onChange={setDatabase}
                    options={[
                      { value: "postgresql", label: "Postgres" },
                      { value: "sqlite", label: "SQLite" },
                    ]}
                  />
                  <SegmentedControl
                    label="Docker files"
                    value={docker ? "yes" : "no"}
                    onChange={(v) => setDocker(v === "yes")}
                    options={[
                      { value: "yes", label: "Include" },
                      { value: "no", label: "Skip" },
                    ]}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
                    <SegmentedControl
                      label="Preset"
                      value={preset}
                      onChange={setPreset}
                      options={[
                        { value: "dashboard", label: "Dash...", tooltip: "Dashboard" },
                        { value: "minimal", label: "Minimal" },
                        { value: "api", label: "API" },
                      ]}
                    />
                    <SegmentedControl
                      label="Dependencies"
                      value={install ? "yes" : "no"}
                      onChange={(v) => setInstall(v === "yes")}
                      options={[
                        { value: "yes", label: "Install" },
                        { value: "no", label: "Skip" },
                      ]}
                    />
                  </div>
                  <p className="text-[11px] leading-snug text-zinc-500">{presetSummary(preset)}</p>
                </div>

                <div className="rounded-lg border border-white/10 bg-zinc-950/50">
                  <button
                    type="button"
                    onClick={() => setAdvancedOpen((open) => !open)}
                    aria-expanded={advancedOpen}
                    className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-medium text-zinc-200 transition hover:bg-white/[0.02]"
                  >
                    <span>Advanced options</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-zinc-500 transition-transform",
                        advancedOpen && "rotate-180",
                      )}
                      aria-hidden
                    />
                  </button>
                  {advancedOpen && (
                    <div className="space-y-2 border-t border-white/10 px-3 pb-3 pt-2">
                      <p className="text-xs text-zinc-500">
                        Choose the parent directory where the project will be created.
                      </p>
                      <label className="block space-y-1.5">
                        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                          Output directory (-c)
                        </span>
                        <input
                          type="text"
                          value={cwd}
                          onChange={(e) => setCwd(e.target.value)}
                          placeholder="/tmp or ./projects"
                          className="w-full rounded-lg border border-white/10 bg-zinc-950/80 px-3 py-2 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </>
            )}

            {!skipPrompts && (
              <p className="rounded-lg border border-white/10 bg-zinc-950/50 px-3 py-2.5 text-sm text-zinc-400">
                Runs without <code className="text-emerald-300/80">-y</code> — the CLI will prompt
                for description, database, Docker, and install.
              </p>
            )}
          </div>

          <div className="order-2 flex flex-col gap-3 bg-zinc-950/45 p-5 sm:p-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto">
            <CommandBlock
              command={command}
              commandParts={commandParts}
              elevated
              showShellPrompt
              header={commandHeader}
              footer={
                <ConfigSummaryBadges
                  skipPrompts={skipPrompts}
                  preset={preset}
                  database={database}
                  docker={docker}
                  install={install}
                />
              }
            />

            <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-white/10 bg-zinc-950/70">
              <div className="border-b border-white/5 px-4 py-2.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  After scaffold
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Run these from the generated project root.
                </p>
              </div>
              <div className="myscroll max-h-[min(420px,50vh)] overflow-y-auto px-3 pb-2 pt-1 lg:max-h-none lg:flex-1">
                <ScaffoldStepList steps={scaffoldSteps} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </TooltipProvider>
  );
}
