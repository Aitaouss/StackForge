Create a modern, high-conversion landing page for an open-source developer CLI tool named "create-stackforge-app".

Design Aesthetic & Theme:

- Theme: Dark-mode first, developer-centric aesthetic inspired by Linear, Raycast, and Vercel.
- Background: Deep slate/zinc background (#09090b) with subtle radial grid/dot patterns and faint emerald/cyan ambient blur glow behind the hero section.
- Color Palette: Neutral zinc borders and text, accented with emerald-500 / teal-400 gradients for badges, glowing borders, and action states.
- Typography: Clean sans-serif (Geist or Inter) for body, and monospace (JetBrains Mono or Fira Code) for CLI commands, flags, and tree views.
- Components & Polish: Tailwind CSS + Lucide icons. Include micro-interactions like subtle hover scale, border glows, and instant copy feedback on terminal commands.

Page Architecture & Sections:

1. Navigation Bar:
   - Sticky top bar with backdrop-blur-md and subtle bottom border (border-zinc-850).
   - Left: Logo icon (anvil/forge symbol) + "StackForge" brand mark with a small "v1.0.8" tag.
   - Center: Nav links (Features, Architecture, CLI Flags, Docs).
   - Right: GitHub star counter button and an npm link button with the npm logo.

2. Hero Section:
   - Top Badge: "⚡ Version 1.0.8 Released • Production-Ready Fullstack Scaffolding" with a glowing badge pill.
   - Headline: "Ship Full-Stack Apps in Seconds, Not Weekends."
   - Subheadline: "The production-ready CLI scaffolding tool. Generates a modern monorepo with Next.js 14, NestJS, Prisma, PostgreSQL/SQLite, Tailwind CSS, shadcn/ui, and JWT auth out of the box."
   - Interactive Terminal Hero Component:
     - Sleek terminal window with macOS-style window dots (red, yellow, green).
     - Displays: `npx create-stackforge-app@latest` with an instant "Copy" button (displays checkmark and tooltip on click).
     - Underneath, an interactive shell preview showing simulated prompt choices:
       ? Project name: › my-saas-app
       ? Database: › PostgreSQL
       ? Enable Docker support? › Yes
       ✔ Ready to deploy in 28s!
   - Secondary CTAs: "ExploreHere is a prompt designed for UI code-generation tools (such as v0, Claude Artifacts, Lovable, or Bolt) to generate a high-converting, developer-focused landing page:

```markdown
Design a modern, high-conversion developer landing page for "create-stackforge-app", a production-grade full-stack CLI scaffolding tool.

### Design Style & Aesthetic

- **Theme:** Dark mode by default (deep charcoal/zinc background `#09090b` with subtle violet/indigo gradients and radial glows).
- **Vibe:** Linear/Vercel-inspired minimalism—clean borders (`border-white/10`), ultra-crisp typography (Inter or Geist), subtle glassmorphism cards, and monospace accents for terminal commands.
- **Micro-interactions:** Interactive copy buttons with checkmark transitions, subtle hover states on cards, and glowing border highlights.

### Page Sections & Content Architecture

1. **Navigation Bar:**
   - Left: Logo icon + `StackForge` brand name + version badge (`v1.0.8` with pulsing green dot).
   - Center/Right: Links to "Documentation", "Features", "Architecture", and a GitHub icon button with star count placeholder.

2. **Hero Section:**
   - **Badge:** Pill-style tag: "⚡ Next.js 14 + NestJS + Prisma + Docker".
   - **Headline:** "From Zero to Production-Ready Full Stack in Seconds."
   - **Subheadline:** "The opinionated CLI that scaffolds typed, end-to-end architectures. Next.js App Router frontend, NestJS backend, Prisma ORM, shadcn/ui, and turnkey JWT auth."
   - **Primary Action (Command Bar):** A prominent, elevated terminal box featuring:
     `npx create-stackforge-app@latest`
     with a single-click copy button (toast/check state on click).
   - **Secondary CTAs:** "View on npm" and "Read Documentation".

3. **Interactive Terminal / Live Preview Demo:**
   - A mock terminal window (macOS style window controls) illustrating the CLI prompt flow:
     - Project name input
     - Select database: `● PostgreSQL  ○ SQLite`
     - Enable Docker: `[Yes/No]`
     - Auto-installing dependencies with pnpm...
     - Done! `cd my-app && pnpm dev`

4. **Tech Stack & Feature Grid (Bento Grid Layout):**
   - **Full-Stack Monorepo:** pnpm workspaces connecting Next.js 14 frontend and NestJS API cleanly.
   - **Turnkey Authentication:** Complete JWT flow (registration, login, protected routes out of the box).
   - **Prisma + Multi-DB:** Zero-friction migrations with PostgreSQL or SQLite, plus Prisma Studio integration.
   - **Production UI:** Pre-wired Tailwind CSS + shadcn/ui with Lucide icons.
   - **Containerization:** Ready-to-go `docker-compose.yml` for database and backend services.

5. **Architecture / Project Structure Preview:**
   - Split-panel view:
     - Left: Visual file tree (`my-app/` > `frontend/`, `backend/`, `docker-compose.yml`, etc.).
     - Right: Feature breakdown showing separation of concerns and typed API communication.

6. **CLI Flags & Non-Interactive Usage:**
   - Clean, scannable table or code snippet tab displaying automated CI/CD-friendly commands:
     - `-y, --yes`: Skip prompts and use defaults.
     - `-d, --database <type>`: Select `postgresql` or `sqlite`.
     - `--docker` / `--no-docker`: Toggle Docker setup.
     - Example snippet: `npx create-stackforge-app@latest my-app -y --database sqlite --no-docker`

7. **Footer:**
   - MIT License notice, npm package link, corepack/pnpm setup note, and links to source repositories.

### Technical Implementation Requirements

- Framework: Next.js (App Router), React, Tailwind CSS.
- Icons: Lucide React (`Terminal`, `Copy`, `Check`, `Database`, `ShieldCheck`, `Layers`, `Box`, `ExternalLink`).
- Use accessible components (Radix / shadcn/ui primitives).
- Ensure strict responsiveness (mobile to ultra-wide desktop).
```
