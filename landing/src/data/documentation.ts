export type DocSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  commands?: string[];
  list?: string[];
  table?: { flag: string; description: string }[];
};

export const documentationSections: DocSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    paragraphs: [
      "create-stackforge-app scaffolds a production-ready pnpm monorepo: apps/web (Next.js 14 App Router), apps/api (NestJS), packages/contracts (shared Zod types), other shared packages, Prisma, PostgreSQL or SQLite, Tailwind + shadcn/ui, JWT auth, optional Docker, and generated CI.",
      "The same npm package ships stackforge doctor and stackforge info for generated projects. Run create with npx—no global install. Node.js 18+.",
    ],
  },
  {
    id: "quick-start",
    title: "Quick start",
    paragraphs: ["Interactive scaffolding:"],
    commands: ["npx create-stackforge-app@latest"],
    list: [
      "Project name and description",
      "Database: PostgreSQL or SQLite",
      "Docker support (yes/no)",
      "Automatic dependency installation with pnpm (yes/no)",
      "Default preset is dashboard (full stack); use --preset for minimal or api",
    ],
  },
  {
    id: "non-interactive",
    title: "Non-interactive mode",
    paragraphs: [
      "Use -y/--yes for defaults (PostgreSQL, Docker, auto-install, preset dashboard), or pass individual flags:",
    ],
    commands: [
      "npx create-stackforge-app@latest my-app -y",
      "npx create-stackforge-app@latest my-api -y --preset api",
      "npx create-stackforge-app@latest my-app -y --database sqlite --no-docker --no-install",
    ],
  },
  {
    id: "cli-flags",
    title: "CLI flags",
    table: [
      { flag: "-p, --preset <name>", description: "dashboard (default), minimal, or api" },
      { flag: "-d, --database <type>", description: "Database: postgresql or sqlite" },
      { flag: "--docker / --no-docker", description: "Generate or skip Docker support" },
      { flag: "--install / --no-install", description: "Install dependencies automatically or skip" },
      { flag: "-y, --yes", description: "Skip all prompts and use defaults" },
      { flag: "-c, --cwd <path>", description: "Working directory for the new project" },
    ],
  },
  {
    id: "presets",
    title: "Presets",
    paragraphs: [
      "Presets control how much is generated. Invalid preset names fail the CLI (no silent fallback).",
    ],
    list: [
      "dashboard — apps/web + apps/api with user admin, profile, settings (default)",
      "minimal — apps/web + apps/api with auth and a simple dashboard (no user CRUD UI)",
      "api — apps/api only (no Next.js app); full REST API including users module",
    ],
    commands: [
      "npx create-stackforge-app@latest my-app -y --preset minimal",
      "npx create-stackforge-app@latest my-api -y --preset api",
    ],
  },
  {
    id: "stackforge-cli",
    title: "stackforge doctor & info",
    paragraphs: [
      "From the root of a generated project (same create-stackforge-app package on npm):",
    ],
    commands: ["npx stackforge doctor", "npx stackforge info"],
    list: [
      "doctor — Node, pnpm, manifest, apps paths, DATABASE_URL, JWT_SECRET, Docker",
      "info — StackForge version, preset, stack versions from package.json files",
    ],
  },
  {
    id: "generated-structure",
    title: "Generated project structure",
    commands: [
      `my-app/
├── apps/
│   ├── api/          # NestJS
│   └── web/          # Next.js (omitted for --preset api)
├── packages/
│   ├── contracts/    # Zod schemas + shared API types
│   ├── typescript-config/
│   ├── eslint-config/
│   └── ui/           # shared stub
├── stackforge.json   # schema v2
├── docker-compose.yml
├── AGENTS.md
└── pnpm-workspace.yaml`,
    ],
    list: [
      "packages/contracts — shared Zod schemas; Nest DTOs and web types stay aligned",
      "JWT auth: register, login, /auth/me (dashboard & minimal include web auth UI)",
      "Prisma schema and migrations under apps/api",
      "Optional Prisma Studio in Docker (PostgreSQL, http://127.0.0.1:5555)",
      "Projects from 1.2.x used frontend/ and backend/ (manifest v1) — see repo docs/MIGRATION-monorepo.md",
    ],
  },
  {
    id: "requirements",
    title: "Requirements",
    paragraphs: [
      "CLI: Node.js >= 18. Generated apps use pnpm workspaces—enable Corepack if pnpm is missing:",
    ],
    commands: ["corepack enable", "corepack prepare pnpm@9 --activate"],
  },
  {
    id: "run-generated",
    title: "Run the generated app",
    commands: [
      "cd my-app && pnpm install && pnpm dev   # from project root — builds & watches contracts",
      "cd my-app && docker compose up -d",
      "cd my-app && npx stackforge doctor",
    ],
    paragraphs: [
      "Use docker compose when you enabled Docker during scaffolding (especially with PostgreSQL).",
      "Migrations and env files live under apps/api/.",
    ],
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    list: [
      "pnpm: command not found → run corepack enable and corepack prepare pnpm@9 --activate",
      "Directory already exists and is not empty → choose another project name or clear the folder",
      "Invalid --database → use postgresql or sqlite only",
      "Invalid --preset → use dashboard, minimal, or api only",
    ],
  },
];
