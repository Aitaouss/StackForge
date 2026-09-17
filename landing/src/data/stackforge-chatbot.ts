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
  "What stack can it generate?",
  "How do I create a new project?",
  "Does it support Docker?",
  "Can I choose Prisma?",
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
    answer: `StackForge is the **create-stackforge-app** CLI—a scaffolding tool that generates a production-ready full-stack monorepo. You get a Next.js 14 frontend, NestJS backend, Prisma ORM, JWT auth, Tailwind + shadcn/ui, optional Docker, and pnpm workspaces in one flow.

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
    answer: `Generated layout:

\`\`\`
my-app/
├── backend/          # NestJS + Prisma + JWT auth
├── frontend/         # Next.js App Router + shadcn/ui
├── docker-compose.yml
├── pnpm-workspace.yaml
├── README.md
└── .env.example
\`\`\`

Includes auth pages (login/register), protected users API, Prisma schema, and env examples.`,
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

- \`-y, --yes\` — all defaults
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

When enabled, the CLI generates \`docker-compose.yml\`, Dockerfiles for frontend/backend, and related config. With **PostgreSQL**, compose can run Postgres, backend, frontend, and Prisma Studio.

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
    answer: `Yes. The backend includes a JWT auth module (register, login, strategy, guards). The frontend ships login/register pages and services wired to the API, plus a protected users endpoint flow out of the box.`,
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
    answer: `**Prisma** is included in every generated backend. You pick the database at scaffold time:

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

- \`-y, --yes\` — skip prompts (PostgreSQL + Docker + install)
- \`-d, --database <postgresql|sqlite>\`
- \`--docker\` / \`--no-docker\`
- \`--install\` / \`--no-install\`
- \`-c, --cwd <path>\`

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

Invalid \`--database\` values must be \`postgresql\` or \`sqlite\`.`,
  },
  {
    id: "docs",
    keywords: ["documentation", "docs", "readme", "help", "learn more"],
    questions: ["Where is the documentation?"],
    answer: `Read the **[documentation](/docs)** on this site for CLI flags, structure, and troubleshooting. The repo [README](${GITHUB_REPO_URL}) and [npm package](${NPM_PACKAGE_URL}) have the same reference material.`,
  },
];
