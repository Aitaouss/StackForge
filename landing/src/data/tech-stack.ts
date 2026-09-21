export type StackLogo = {
  name: string;
  slug: string;
  /** Simple Icons hex without # */
  color: string;
  role: string;
};

/** Logos via Simple Icons CDN (https://simpleicons.org). */
export const STACK_LOGOS: StackLogo[] = [
  { name: "Next.js", slug: "nextdotjs", color: "FFFFFF", role: "App Router UI" },
  { name: "React", slug: "react", color: "61DAFB", role: "Frontend" },
  { name: "TypeScript", slug: "typescript", color: "3178C6", role: "End-to-end types" },
  { name: "NestJS", slug: "nestjs", color: "E0234E", role: "REST API" },
  { name: "Node.js", slug: "nodedotjs", color: "339933", role: "Runtime" },
  { name: "Prisma", slug: "prisma", color: "FFFFFF", role: "ORM & migrations" },
  { name: "PostgreSQL", slug: "postgresql", color: "4169E1", role: "Primary DB" },
  { name: "SQLite", slug: "sqlite", color: "FFFFFF", role: "Local DB" },
  { name: "Docker", slug: "docker", color: "2496ED", role: "Compose stack" },
  { name: "pnpm", slug: "pnpm", color: "F69220", role: "Monorepo" },
  { name: "Tailwind CSS", slug: "tailwindcss", color: "06B6D4", role: "Styling" },
  { name: "Zod", slug: "zod", color: "3E67B1", role: "Env validation" },
  { name: "Jest", slug: "jest", color: "C21325", role: "Unit & e2e tests" },
  { name: "ESLint", slug: "eslint", color: "4B32C3", role: "Linting" },
  { name: "GitHub Actions", slug: "githubactions", color: "FFFFFF", role: "Generated CI" },
];

export const SHIPPED_CAPABILITIES = [
  "JWT auth: register, login, /auth/me session hydration, protected routes",
  "Bcrypt password hashing and per-project JWT_SECRET",
  "Prisma migrations (PostgreSQL & SQLite) with db:deploy",
  "GET /health — API uptime and database status",
  "Zod-validated environment, Helmet, throttling, request IDs",
  "shadcn/ui + Tailwind dashboard, React Query, Axios API client",
  "Backend unit tests, Supertest e2e, ESLint & typecheck scripts",
  "docker compose: Postgres, apps/api, apps/web, Prisma Studio",
  "Presets: dashboard (full), minimal (auth + simple UI), api (NestJS-only)",
  "stackforge.json v2, stackforge doctor & info, AGENTS.md, generated CI",
] as const;
