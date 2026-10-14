<div align="center">

# 🚀 StackForge

### Scaffold production-ready full-stack apps in seconds

[![npm version](https://img.shields.io/npm/v/create-stackforge-app?color=brightgreen)](https://www.npmjs.com/package/create-stackforge-app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-blue)](https://www.typescriptlang.org/)

[Quick Start](#-quick-start) • [Features](#-features) • [Documentation](#-usage) • [Project Structure](#-generated-project-structure)

<br>

[![StackForge Demo](https://img.shields.io/badge/🎬_View_Demo-Click_Here-orange?style=for-the-badge)](https://github.com/Aitaouss/StackForge)

_Click above to explore a generated project_

---

</div>

## 📖 Overview

**StackForge** is a production-ready CLI scaffolding tool that generates a modern full-stack application with industry-standard technologies. Get a complete development environment with authentication, database integration, Docker support, and beautiful UI components — all configured and ready to run.

Whether you're building a SaaS platform, internal tool, or MVP, StackForge eliminates hours of boilerplate setup so you can focus on building features.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### Frontend

- ⚡ **Next.js 16** with App Router & TypeScript
- 🎨 **Tailwind CSS** for styling
- 🧩 **shadcn/ui** component library
- 🔄 **Axios** for API communication
- 📱 Responsive design out of the box

</td>
<td width="50%">

### Backend

- 🛡️ **NestJS** REST API with TypeScript
- 🔐 **JWT authentication** (register/login/protected routes)
- 🗄️ **Prisma** ORM with migrations
- 🐘 **PostgreSQL** or 🪶 **SQLite** support
- ✅ Production-ready architecture

</td>
</tr>
<tr>
<td colspan="2">

### DevOps & Tooling

- 🐳 **Docker** & docker-compose configuration
- 🔍 **Prisma Studio** visual database browser (Docker + PostgreSQL)
- 📦 **pnpm** workspaces for monorepo management
- 🔄 Hot reload for frontend and backend
- 🚀 One command to start everything

</td>
</tr>
</table>

---

## 🛠️ Technology Stack

| Layer               | Technologies                                           |
| ------------------- | ------------------------------------------------------ |
| **Frontend**        | Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend**         | NestJS, Node.js, TypeScript, JWT                       |
| **Database**        | Prisma ORM, PostgreSQL / SQLite                        |
| **API Client**      | Axios                                                  |
| **DevOps**          | Docker, docker-compose                                 |
| **Package Manager** | pnpm (workspaces)                                      |

---

## 🚀 Quick Start

### Create a New Project

```bash
npx create-stackforge-app@latest
```

You'll be prompted for:

- Project name
- Project description
- Database choice (PostgreSQL or SQLite)
- Docker support
- Automatic dependency installation

### Requirements for Generated Projects

The generated projects use [pnpm](https://pnpm.io/) workspaces. Node.js includes [corepack](https://nodejs.org/api/corepack.html), which installs pnpm automatically. If you see a "pnpm: command not found" error, run:

```bash
corepack enable
corepack prepare pnpm@9 --activate
```

Then `pnpm install`, `pnpm dev`, etc. will work.

---

## 📘 Usage

### Interactive Mode (Default)

```bash
npx create-stackforge-app@latest
```

Answer the prompts to customize your project setup.

### Non-Interactive Mode

Skip prompts entirely with `-y/--yes`, or pass individual flags to skip only those prompts:

```bash
# Use all defaults: PostgreSQL + Docker + auto-install
npx create-stackforge-app@latest my-app -y

# Custom configuration without prompts
npx create-stackforge-app@latest my-app -y --database sqlite --no-docker --no-install
```

### CLI Flags

| Flag                         | Description                                |
| ---------------------------- | ------------------------------------------ |
| `-d, --database <type>`      | Database: `postgresql` or `sqlite`         |
| `--docker` / `--no-docker`   | Generate or skip Docker support            |
| `--install` / `--no-install` | Install dependencies automatically or skip |
| `-y, --yes`                  | Skip all prompts and use defaults          |
| `-c, --cwd <path>`           | Working directory                          |

---

## 🏗️ Generated Project Structure

```
my-app/
├── backend/              # NestJS application
│   ├── src/
│   │   ├── auth/        # JWT authentication module
│   │   ├── users/       # Users module with protected routes
│   │   └── prisma/      # Prisma client service
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── frontend/             # Next.js application
│   ├── app/
│   │   ├── login/       # Login page
│   │   ├── register/    # Registration page
│   │   └── users/       # Protected users page
│   ├── components/
│   │   └── ui/          # shadcn/ui components
│   └── package.json
├── docker-compose.yml    # Docker orchestration
├── README.md
└── .env.example
```

---

## 🎯 Featured Functionality

### 🔐 Complete Authentication Flow

- User registration with email and password
- Secure login with JWT tokens
- Protected API routes with guards
- Token-based authentication in frontend

### 🗄️ Database Management

- Prisma schema pre-configured with User model
- Database migrations ready to run
- Prisma Studio integration for visual browsing (Docker + PostgreSQL)
- Support for PostgreSQL (production) or SQLite (development)

### 🐳 Docker Integration

- Multi-container setup with docker-compose
- Separate services for frontend, backend, database, and Prisma Studio
- Environment variables configured
- One command to start: `docker compose up -d`

### 🎨 Modern UI Components

- Pre-installed shadcn/ui components
- Tailwind CSS configured with design tokens
- Dark mode support
- Responsive layouts

---

## 💻 Local Development

### For This CLI Tool (StackForge)

#### Install Dependencies

```bash
pnpm install
```

#### Build

```bash
pnpm run build
```

#### Development Scripts

| Script                    | Description                       |
| ------------------------- | --------------------------------- |
| `pnpm run build`          | Compile TypeScript to JavaScript  |
| `pnpm run watch`          | Watch mode for development        |
| `pnpm run clean`          | Remove build artifacts            |
| `pnpm run prepublishOnly` | Clean and build before publishing |

#### Run Locally

```bash
node ./bin/create-stackforge-app.js
```

---

## 📦 What Gets Generated

After running StackForge, you'll have:

✅ Fully configured Next.js frontend with App Router  
✅ NestJS backend with authentication endpoints  
✅ Database integration with Prisma ORM  
✅ JWT authentication working end-to-end  
✅ Docker setup (if selected)  
✅ Prisma Studio service (Docker + PostgreSQL)  
✅ Example protected routes and pages  
✅ Beautiful UI with shadcn/ui components  
✅ TypeScript configured across the stack  
✅ Development and production scripts

---

## 🌐 Connect

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-Aitaouss-181717?style=flat&logo=github)](https://github.com/Aitaouss)
[![Repository](https://img.shields.io/badge/Repository-StackForge-blue?style=flat&logo=github)](https://github.com/Aitaouss/StackForge)
[![npm](https://img.shields.io/badge/npm-create--stackforge--app-CB3837?style=flat&logo=npm)](https://www.npmjs.com/package/create-stackforge-app)

</div>

---

## 📄 License

MIT © StackForge

---

<div align="center">

**[⬆ back to top](#-stackforge)**

Made with ❤️ by the StackForge team

</div>
