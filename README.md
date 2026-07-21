# create-stackforge-app

A production-ready CLI scaffolding tool that generates a full-stack application with Next.js (App Router), NestJS, Prisma, PostgreSQL/SQLite, Tailwind CSS, shadcn/ui, JWT authentication, Axios, Docker, and pnpm.

## Features

- ⚡ **Next.js 14** with App Router and TypeScript
- 🛡️ **NestJS** backend with JWT authentication
- 🗄️ **Prisma** ORM with PostgreSQL or SQLite
- 🎨 **Tailwind CSS** + **shadcn/ui** components
- 🐳 **Docker** and docker-compose support
- 🔍 **Prisma Studio** service for visual database browsing (Docker, PostgreSQL)
- 📦 **pnpm** workspaces
- 🔐 Auth flow: register, login, protected users API
- 🚀 Ready to run with `docker compose up -d` or `pnpm dev`

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

### Non-interactive mode

Skip prompts entirely with `-y/--yes`, or pass individual flags to skip only those prompts:

```bash
# Defaults: PostgreSQL + Docker + auto-install
npx create-stackforge-app@latest my-app -y

# Custom, no prompts
npx create-stackforge-app@latest my-app -y --database sqlite --no-docker --no-install
```

| Flag | Description |
| ---- | ----------- |
| `-d, --database <type>` | Database: `postgresql` or `sqlite` |
| `--docker` / `--no-docker` | Generate or skip Docker support |
| `--install` / `--no-install` | Install dependencies automatically or skip |
| `-y, --yes` | Skip all prompts and use defaults |
| `-c, --cwd <path>` | Working directory |

## Generated Project Structure

```
my-app/
├── backend/          # NestJS application
├── frontend/         # Next.js application
├── docker-compose.yml
├── README.md
└── .env.example
```

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

## License

MIT
