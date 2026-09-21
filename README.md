# create-stackforge-app

A production-ready CLI scaffolding tool that generates a full-stack application with Next.js (App Router), NestJS, Prisma, PostgreSQL/SQLite, Tailwind CSS, shadcn/ui, JWT authentication, shared API contracts (Zod), Axios, Docker, and pnpm workspaces.

**Releases:** [GitHub Releases](https://github.com/Aitaouss/StackForge/releases)

## Features

- ⚡ **Next.js 14** with App Router and TypeScript
- 🛡️ **NestJS** backend with JWT authentication
- 📜 **Shared contracts** — Zod schemas and types in `packages/contracts` (API + web)
- 🗄️ **Prisma** ORM with PostgreSQL or SQLite
- 🎨 **Tailwind CSS** + **shadcn/ui** components
- 🐳 **Docker** and docker-compose support
- 🔍 **Prisma Studio** in Docker (PostgreSQL stacks; bound to localhost)
- 📦 **pnpm** workspaces (`apps/*`, `packages/*`)
- 🎛️ **Presets** — `dashboard`, `minimal`, or `api`-only
- 🔧 **`stackforge doctor` / `stackforge info`** in generated projects
- 🔐 Auth flow: register, login, protected users API
- 🚀 Run with `docker compose up -d` or **`pnpm dev` from the project root**

**Node.js:** 18+ supported; **Node 22** is used in StackForge CI.

## Usage

```bash
npx create-stackforge-app@latest
```

### Requirements for generated projects

The generated projects use [pnpm](https://pnpm.io/) workspaces. Node.js includes [corepack](https://nodejs.org/api/corepack.html), which installs pnpm automatically. If you see a "pnpm: command not found" error, run:

```bash
corepack enable
corepack prepare pnpm@9 --activate
```

Then `pnpm install`, `pnpm dev`, etc. will work.

You will be prompted for:

- Project name
- Project description
- Database (PostgreSQL or SQLite)
- Docker support
- Automatic dependency installation

### Presets

| Preset                | What you get                                                            |
| --------------------- | ----------------------------------------------------------------------- |
| `dashboard` (default) | Web + API: auth, user admin, dashboard, profile/settings                |
| `minimal`             | Web + API without dashboard profile/settings UI and related API surface |
| `api`                 | Backend only (`apps/api`); no `apps/web`                                |

### Non-interactive mode

Skip prompts entirely with `-y/--yes`, or pass individual flags to skip only those prompts:

```bash
# Defaults: PostgreSQL + Docker + auto-install
npx create-stackforge-app@latest my-app -y

# Custom, no prompts
npx create-stackforge-app@latest my-app -y --database sqlite --no-docker --no-install

npx create-stackforge-app@latest my-api -y --preset api
npx create-stackforge-app@latest my-app -y --preset minimal
```

| Flag                         | Description                                |
| ---------------------------- | ------------------------------------------ |
| `-d, --database <type>`      | Database: `postgresql` or `sqlite`         |
| `-p, --preset <name>`        | `dashboard` (default), `minimal`, or `api` |
| `--docker` / `--no-docker`   | Generate or skip Docker support            |
| `--install` / `--no-install` | Install dependencies automatically or skip |
| `-y, --yes`                  | Skip all prompts and use defaults          |
| `-c, --cwd <path>`           | Working directory                          |

Inside a generated project:

```bash
npx stackforge doctor
npx stackforge info
```

Run **`pnpm dev` from the project root** so `packages/contracts` is built and watched (do not start only a single app filter unless you have already built contracts).

## Generated Project Structure

```
my-app/
├── apps/
│   ├── api/          # NestJS application
│   └── web/          # Next.js application (not included for `--preset api`)
├── packages/
│   ├── contracts/    # Zod schemas + shared API types
│   ├── eslint-config/
│   ├── typescript-config/
│   └── ui/           # shared UI stub
├── stackforge.json   # StackForge project manifest (schema v2)
├── AGENTS.md         # Architecture notes for humans and AI tools
├── .stackforge/      # Reserved for StackForge tooling metadata
├── docker-compose.yml
├── README.md
└── .env.example
```

Projects created with **1.2.x** used `frontend/` + `backend/` (manifest v1). See [docs/MIGRATION-monorepo.md](./docs/MIGRATION-monorepo.md).

PostgreSQL + Docker: **Prisma Studio** is exposed at **http://127.0.0.1:5555** (localhost only).

## Development

### Install dependencies

Make sure pnpm is available (see [corepack](https://nodejs.org/api/corepack.html)):

```bash
pnpm install
```

### Build

```bash
pnpm run build
```

### Run locally

```bash
node ./bin/create-stackforge-app.js
```

### Smoke-test generated apps (maintainers)

After changing templates or the CLI:

```bash
pnpm run smoke              # SQLite + PostgreSQL generate smoke
pnpm run smoke:sqlite       # SQLite (dashboard preset)
pnpm run smoke:postgresql   # PostgreSQL (dashboard preset)
pnpm run smoke:presets      # SQLite: dashboard, minimal, api
pnpm run smoke:docker       # Docker build + API health + Prisma Studio query
```

See [Phases-stack-forge.md](./Phases-stack-forge.md), [docs/file-ownership.md](./docs/file-ownership.md), and [docs/tested-stack.md](./docs/tested-stack.md).

## License

MIT
