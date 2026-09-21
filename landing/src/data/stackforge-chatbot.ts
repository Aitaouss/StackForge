export type ChatbotKnowledgeItem = {
  id: string;
  keywords: string[];
  questions?: string[];
  answer: string;
};

export const GITHUB_REPO_URL = "https://github.com/Aitaouss/StackForge";
export const NPM_PACKAGE_URL = "https://www.npmjs.com/package/create-stackforge-app";

export const CHATBOT_GREETING =
  "Hey 👋 I'm the StackForge Assistant. Ask me anything about StackForge.";

export const CHATBOT_FALLBACK_ANSWER =
  "I'm not sure about that yet. I can answer questions about StackForge's CLI, supported technologies, generated projects, setup, Docker, databases, authentication, and project structure.";

export const SUGGESTED_QUESTIONS = [
  "What is StackForge?",
  "What are the CLI presets?",
  "How do I create a new project?",
  "Does it support Docker?",
  "What is stackforge doctor?",
  "What does the generated project include?",
] as const;

export const FALLBACK_SUGGESTIONS = [
  "How do I create a new project?",
  "What technologies does StackForge support?",
  "What do I need installed?",
] as const;

export const stackforgeKnowledge: ChatbotKnowledgeItem[] = [
  {
    id: "what-is",
    keywords: ["stackforge", "what is", "about", "create-stackforge-app", "cli", "tool", "scaffold"],
    questions: ["What is StackForge?", "What does StackForge do?"],
    answer: `StackForge is the **create-stackforge-app** CLI—a scaffolding tool that generates a production-ready pnpm monorepo with **apps/web** (Next.js 14), **apps/api** (NestJS), shared **packages/**, Prisma, JWT auth, Tailwind + shadcn/ui, optional Docker, **stackforge.json v2**, and **stackforge doctor** / **info**.

Run it with:

\`\`\`
npx create-stackforge-app@latest
\`\`\``,
  },
  {
    id: "technologies",
    keywords: [
      "technology",
      "technologies",
      "stack",
      "support",
      "framework",
      "frontend",
      "backend",
      "nextjs",
      "next.js",
      "nestjs",
      "tailwind",
      "shadcn",
      "axios",
      "jwt",
      "pnpm",
    ],
    questions: [
      "What stack can it generate?",
      "What technologies does StackForge support?",
    ],
    answer: `Confirmed stack from this project:

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Lucide, Axios
- **Backend:** NestJS, JWT authentication (register, login, guards)
- **Data:** Prisma ORM with **PostgreSQL** or **SQLite**
- **Tooling:** pnpm workspaces, optional Docker / docker-compose
- **Extras:** Prisma Studio service when using Docker + PostgreSQL

Package: [create-stackforge-app on npm](${NPM_PACKAGE_URL})`,
  },
  {
    id: "getting-started",
    keywords: [
      "create",
      "start",
      "use",
      "install",
      "run",
      "npx",
      "new project",
      "getting started",
      "how do i",
    ],
    questions: ["How do I create a new project?", "How do I use StackForge?"],
    answer: `Scaffold interactively:

\`\`\`
npx create-stackforge-app@latest
\`\`\`

Non-interactive (defaults: PostgreSQL, Docker, auto-install):

\`\`\`
npx create-stackforge-app@latest my-app -y
\`\`\`

Then:

\`\`\`
cd my-app && pnpm dev
\`\`\`

Or with Docker:

\`\`\`
cd my-app && docker compose up -d
\`\`\``,
  },
  {
    id: "generated",
    keywords: [
      "generate",
      "generated",
      "structure",
      "folder",
      "include",
      "output",
      "monorepo",
      "project structure",
    ],
    questions: ["What does the generated project include?", "What does StackForge generate?"],
    answer: `Generated layout (v1.3.0+):

\`\`\`
my-app/
├── apps/api/         # NestJS + Prisma + JWT
├── apps/web/         # Next.js (not included for --preset api)
├── packages/         # typescript-config, eslint-config, ui stub
├── stackforge.json   # manifest v2
├── docker-compose.yml
├── pnpm-workspace.yaml
├── AGENTS.md
└── README.md
\`\`\`

**dashboard** preset includes full auth UI, user admin, profile, and settings. **minimal** is auth + simple dashboard. **api** is NestJS-only.`,
  },
  {
    id: "customization",
    keywords: [
      "customize",
      "choose",
      "options",
      "prompt",
      "flags",
      "select",
      "configuration",
      "stack",
    ],
    questions: ["Can I choose my stack?", "Can I customize the generated stack?"],
    answer: `Interactive prompts let you set:

- Project name and description
- Database: **PostgreSQL** or **SQLite**
- Docker support (yes/no)
- Auto-install dependencies with pnpm (yes/no)

CLI flags skip prompts:

- \`-y, --yes\` — all defaults (preset **dashboard**)
- \`-p, --preset dashboard|minimal|api\`
- \`-d, --database postgresql|sqlite\`
- \`--docker\` / \`--no-docker\`
- \`--install\` / \`--no-install\`
- \`-c, --cwd <path>\`

Example:

\`\`\`
npx create-stackforge-app@latest my-app -y --database sqlite --no-docker
\`\`\``,
  },
  {
    id: "docker",
    keywords: ["docker", "compose", "container", "containers", "postgres container"],
    questions: ["Does it support Docker?", "Does StackForge support Docker?"],
    answer: `Yes—optional Docker support during scaffolding.

When enabled, the CLI generates \`docker-compose.yml\`, Dockerfiles under apps/api and apps/web, and related config. With **PostgreSQL**, compose can run Postgres, API, web (if preset includes it), and Prisma Studio.

Start services:

\`\`\`
docker compose up -d
\`\`\`

Skip Docker with \`--no-docker\` or answer "No" at the prompt.`,
  },
  {
    id: "auth",
    keywords: [
      "auth",
      "authentication",
      "jwt",
      "login",
      "register",
      "password",
      "protected",
    ],
    questions: ["Does StackForge generate authentication?"],
    answer: `Yes. **apps/api** includes JWT auth (register, login, strategy, guards). When the preset includes web, **apps/web** ships login/register and services wired to the API. The **dashboard** preset adds user admin and profile/settings; **minimal** keeps auth with a simpler dashboard; **api** is API-only.`,
  },
  {
    id: "prisma-database",
    keywords: [
      "prisma",
      "database",
      "postgresql",
      "postgres",
      "sqlite",
      "orm",
      "migration",
      "studio",
    ],
    questions: [
      "Can I choose Prisma?",
      "Does it support Prisma?",
      "What database can I use?",
      "Does it configure PostgreSQL?",
    ],
    answer: `**Prisma** lives in **apps/api**. You pick the database at scaffold time:

- **PostgreSQL** — needs Docker or a local Postgres instance
- **SQLite** — lightweight, no extra services

Prisma schema and client are preconfigured. With Docker + PostgreSQL, Prisma Studio can be exposed via docker-compose.`,
  },
  {
    id: "requirements",
    keywords: [
      "requirement",
      "requirements",
      "node",
      "pnpm",
      "corepack",
      "need installed",
      "prerequisite",
    ],
    questions: ["What do I need installed?"],
    answer: `For the CLI: **Node.js 18+** (see \`engines\` in the package).

Generated apps use **pnpm** workspaces. Enable it via Corepack if needed:

\`\`\`
corepack enable
corepack prepare pnpm@9 --activate
\`\`\`

For PostgreSQL locally, use Docker from the generated compose file or your own Postgres instance.`,
  },
  {
    id: "commands",
    keywords: ["command", "commands", "flags", "cli", "non-interactive", "yes", "cwd"],
    questions: ["What are the CLI flags?", "Common commands?"],
    answer: `Main command:

\`\`\`
npx create-stackforge-app@latest
\`\`\`

Useful flags:

- \`-y, --yes\` — skip prompts (PostgreSQL + Docker + install + preset dashboard)
- \`-p, --preset dashboard|minimal|api\`
- \`-d, --database <postgresql|sqlite>\`
- \`--docker\` / \`--no-docker\`
- \`--install\` / \`--no-install\`
- \`-c, --cwd <path>\`

In a generated project:

\`\`\`
npx stackforge doctor
npx stackforge info
\`\`\`

Develop the CLI locally (repo root):

\`\`\`
pnpm install && pnpm run build && node ./bin/create-stackforge-app.js
\`\`\``,
  },
  {
    id: "manual-vs",
    keywords: [
      "difference",
      "manual",
      "why",
      "compare",
      "versus",
      "vs",
      "boilerplate",
    ],
    questions: ["How is StackForge different from setting up manually?"],
    answer: `Manual setup means wiring Next.js, NestJS, Prisma, auth, Tailwind, shadcn/ui, workspaces, env files, and Docker yourself. StackForge applies opinionated defaults in one pass: matching folder layout, JWT flow, API client services, and compose files—so you start from a runnable baseline instead of weeks of glue code.`,
  },
  {
    id: "github",
    keywords: ["github", "source", "repository", "repo", "code", "open source"],
    questions: ["Where is the source code?"],
    answer: `Source and templates live on GitHub:

[github.com/Aitaouss/StackForge](${GITHUB_REPO_URL})

npm package: [create-stackforge-app](${NPM_PACKAGE_URL})`,
  },
  {
    id: "troubleshooting",
    keywords: [
      "pnpm not found",
      "error",
      "troubleshoot",
      "fix",
      "problem",
      "empty directory",
      "exists",
    ],
    questions: ["pnpm command not found?"],
    answer: `If generated projects report **pnpm: command not found**, enable Corepack:

\`\`\`
corepack enable
corepack prepare pnpm@9 --activate
\`\`\`

If scaffolding fails because the target folder **already exists and is not empty**, pick a new project name or remove the directory.

Invalid \`--database\` values must be \`postgresql\` or \`sqlite\`.

Invalid \`--preset\` values must be \`dashboard\`, \`minimal\`, or \`api\`.`,
  },
  {
    id: "presets",
    keywords: ["preset", "presets", "minimal", "api preset", "dashboard preset"],
    questions: ["What are the CLI presets?", "What is --preset minimal?"],
    answer: `**Presets** (v1.3.0+):

- **dashboard** — default; apps/web + apps/api with user CRUD UI, profile, settings
- **minimal** — apps/web + apps/api with auth and a simple dashboard (no user admin)
- **api** — apps/api only (no Next.js app); full NestJS API

Example:

\`\`\`
npx create-stackforge-app@latest my-api -y --preset api
\`\`\`

Omit \`--preset\` or use \`dashboard\` for the full stack.`,
  },
  {
    id: "doctor",
    keywords: ["doctor", "info", "stackforge doctor", "diagnose", "health check"],
    questions: ["What is stackforge doctor?"],
    answer: `**stackforge doctor** and **stackforge info** ship in the same npm package as create-stackforge-app. Run them from your generated project root:

\`\`\`
npx stackforge doctor
npx stackforge info
\`\`\`

Doctor checks Node, pnpm, \`stackforge.json\`, apps paths, env, and JWT secret. Info prints manifest and dependency versions for support.`,
  },
  {
    id: "docs",
    keywords: ["documentation", "docs", "readme", "help", "learn more"],
    questions: ["Where is the documentation?"],
    answer: `Read the **[documentation](/docs)** on this site for CLI flags, structure, and troubleshooting. The repo [README](${GITHUB_REPO_URL}) and [npm package](${NPM_PACKAGE_URL}) have the same reference material.`,
  },
];
