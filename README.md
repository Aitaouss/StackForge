# create-stackforge-app

A production-ready CLI scaffolding tool that generates a full-stack application with Next.js (App Router), NestJS, Prisma, PostgreSQL/SQLite, Tailwind CSS, shadcn/ui, JWT authentication, Axios, Docker, and pnpm.

## Features

- ⚡ **Next.js 14** with App Router and TypeScript
- 🛡️ **NestJS** backend with JWT authentication
- 🗄️ **Prisma** ORM with PostgreSQL or SQLite
- 🎨 **Tailwind CSS** + **shadcn/ui** components
- 🐳 **Docker** and docker-compose support
- 📦 **pnpm** workspaces
- 🔐 Auth flow: register, login, protected users API
- 🚀 Ready to run with `docker compose up -d` or `pnpm dev`

## Usage

```bash
npx create-stackforge-app
```

You will be prompted for:

- Project name
- Project description
- Database (PostgreSQL or SQLite)
- Docker support
- Automatic dependency installation

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
