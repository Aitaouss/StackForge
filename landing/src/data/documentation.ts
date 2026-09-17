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
      "create-stackforge-app is a CLI that scaffolds a production-ready full-stack monorepo: Next.js 14 (App Router), NestJS, Prisma, PostgreSQL or SQLite, Tailwind CSS, shadcn/ui, JWT authentication, Axios, optional Docker, and pnpm workspaces.",
      "Run it with npx—no global install required. Generated projects target Node.js 18+.",
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
    ],
  },
  {
    id: "non-interactive",
    title: "Non-interactive mode",
    paragraphs: [
      "Use -y/--yes for defaults (PostgreSQL, Docker, auto-install), or pass individual flags:",
    ],
    commands: [
      "npx create-stackforge-app@latest my-app -y",
      "npx create-stackforge-app@latest my-app -y --database sqlite --no-docker --no-install",
    ],
  },
  {
    id: "cli-flags",
    title: "CLI flags",
    table: [
      { flag: "-d, --database <type>", description: "Database: postgresql or sqlite" },
      { flag: "--docker / --no-docker", description: "Generate or skip Docker support" },
      { flag: "--install / --no-install", description: "Install dependencies automatically or skip" },
      { flag: "-y, --yes", description: "Skip all prompts and use defaults" },
      { flag: "-c, --cwd <path>", description: "Working directory for the new project" },
    ],
  },
  {
    id: "generated-structure",
    title: "Generated project structure",
    commands: [
      `my-app/
├── backend/          # NestJS application
├── frontend/         # Next.js application
├── docker-compose.yml
├── README.md
└── .env.example`,
    ],
    list: [
      "JWT auth: register, login, protected users API",
      "Prisma schema and migrations workflow",
      "Frontend auth pages and API services",
      "Optional Prisma Studio in Docker (PostgreSQL)",
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
      "cd my-app && pnpm install && pnpm dev",
      "cd my-app && docker compose up -d",
    ],
    paragraphs: [
      "Use docker compose when you enabled Docker during scaffolding (especially with PostgreSQL).",
    ],
  },
  {
    id: "develop-cli",
    title: "Develop the CLI (StackForge repo)",
    commands: [
      "pnpm install",
      "pnpm run build",
      "node ./bin/create-stackforge-app.js",
    ],
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    list: [
      "pnpm: command not found → run corepack enable and corepack prepare pnpm@9 --activate",
      "Directory already exists and is not empty → choose another project name or clear the folder",
      "Invalid --database → use postgresql or sqlite only",
    ],
  },
  {
    id: "landing-site",
    title: "Landing site (this website)",
    paragraphs: [
      "The marketing site lives in the landing/ directory. Run it locally with:",
    ],
    commands: ["cd landing", "pnpm install", "pnpm dev"],
    list: [
      "Home: product overview, CLI demo, npm weekly downloads",
      "/docs: full documentation (this page)",
      "StackForge Assistant chatbot: local knowledge base, no external API",
    ],
  },
];
