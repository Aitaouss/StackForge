# Phase 4 — Priority 1 explained (`g resource` and `add`)

This guide is for **you already have an app from StackForge** and want to understand what the next CLI commands will do — with **real paths** that match **create-stackforge-app 1.4.x** today.

**Status today:** **`stackforge g resource`** ships in **create-stackforge-app 1.5.0** (API + contracts + Prisma MVP). Run it from a generated project with **`pnpm exec stackforge g resource …`** or **`pnpm run generate -- resource …`**. **`stackforge add`** is still planned. This document describes behavior using your **existing** project as the reference pattern.

**Related:** [phase-4-build.md](./phase-4-build.md) (roadmap order) · [Phases-stack-forge.md](../Phases-stack-forge.md) (full spec)

---

## Step 0 — The app you already have

Imagine you scaffolded a typical full-stack app:

```bash
pnpm dlx create-stackforge-app@1.4.2 my-saas-app -y
cd my-saas-app
pnpm run db:setup
pnpm dev
```

Preset **dashboard**, **PostgreSQL**, **Docker** enabled. Your tree looks like this (simplified):

```text
my-saas-app/
├── apps/
│   ├── api/
│   │   ├── prisma/
│   │   │   ├── schema.prisma      ← model User today
│   │   │   └── migrations/
│   │   └── src/
│   │       ├── auth/              ← register, login, JWT
│   │       └── users/             ← CRUD API for User (already there)
│   └── web/
│       └── src/
│           ├── services/api.ts    ← Axios + Bearer token
│           └── hooks/use-users.ts ← fetches /users
├── packages/
│   └── contracts/
│       └── src/
│           ├── auth.ts            ← login/register Zod types
│           └── users.ts           ← User Zod types (shared with API + web)
└── stackforge.json                ← preset, database, apps paths
```

### What StackForge already built for you (the pattern to copy)

The **User** feature is your blueprint. Phase 4 generators will **repeat this pattern** for new names like `Product` or `Post`.

| Piece                  | Where it lives today (User)                                            |
| ---------------------- | ---------------------------------------------------------------------- |
| Database table         | `apps/api/prisma/schema.prisma` → `model User`                         |
| API                    | `apps/api/src/users/` (controller, service, DTOs)                      |
| Shared types           | `packages/contracts/src/users.ts` (Zod + `User`, `CreateUserInput`, …) |
| Web (dashboard preset) | hooks/services that call `/users` with JWT                             |

You did **not** get a `Product` table or `/products` API from create — only **User** + **auth**. Phase 4 **`g resource`** adds **new** domain features the same way **User** was wired.

---

## Part A — `stackforge g resource` (short: `stackforge g`)

### What it means

- **`g`** = **generate**
- **`resource`** = a **named thing in your product** stored in the DB and exposed via API (and optionally UI): product, post, order, category, …

**One command** should add everything that belongs to that name, aligned with **contracts** (Phase 3), not three copy-paste folders that drift apart.

### Real example: add `Product` to `my-saas-app`

**Today (manual — what you would do without Phase 4):**

1. Edit `schema.prisma`, add `model Product { … }`, run migrate
2. Create `apps/api/src/products/` (module, service, controller, DTOs)
3. Add `packages/contracts/src/products.ts` and export from `index.ts`
4. Add web hooks/pages under `apps/web`
5. Register `ProductsModule` in `app.module.ts`
6. Keep Swagger, auth guards, and types in sync by hand

**With create-stackforge-app 1.5.0 (MVP — shipped today):**

```bash
cd my-saas-app

# See what would change — no files written yet
pnpm exec stackforge g resource product --dry-run

# Generate API + contracts + Prisma (no web UI in MVP)
pnpm exec stackforge g resource product \
  --field "name:string:required" \
  --field "sku:string:required"
```

Same via root script: `pnpm run generate -- resource product --field name:string:required`.

**MVP limits:** required **string** fields only; no `--ui`, no decimal/int flags, no interactive wizard. **`post`** is the CI default (built-in `title` + `content` fields). Web list/forms come in a later slice.

### What should appear in the project (concrete “after”)

**Prisma** — new model next to `User`:

```prisma
// apps/api/prisma/schema.prisma (excerpt AFTER g resource product)

model User { … }   // unchanged — your auth/admin still uses this

model Product {
  id        String   @id @default(uuid())
  name      String
  sku       String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("products")
}
```

Then you run (generator may remind you):

```bash
pnpm --filter ./apps/api exec prisma migrate dev --name add_product
pnpm --filter ./packages/contracts run build
```

**Contracts** — new file, same style as `users.ts`:

```text
packages/contracts/src/products.ts   ← CREATE
packages/contracts/src/index.ts    ← MODIFY (export products)
```

**API** — parallel to `users/`:

```text
apps/api/src/products/
├── products.module.ts
├── products.controller.ts
├── products.service.ts
└── dto/
    ├── create-product.dto.ts    ← from Zod / nestjs-zod like User
    └── update-product.dto.ts
apps/api/src/app.module.ts       ← MODIFY (import ProductsModule)
```

**Web** (not in MVP — planned later):

```text
apps/web/src/hooks/use-products.ts     ← future: React Query pattern like use-users
apps/web/src/app/(dashboard)/...       ← future: list/form routes
```

**Manifest** (track what you own):

```json
// stackforge.json — example future entry
{
  "features": { … },
  "generatedResources": ["product"]
}
```

Generated **product** code is **yours** — future `stackforge upgrade` must not overwrite it ([file-ownership.md](./file-ownership.md)).

### How this mirrors what you already have (User)

| User (shipped in create) | Product (after `g resource product`)           |
| ------------------------ | ---------------------------------------------- |
| `model User`             | `model Product`                                |
| `src/users/*`            | `src/products/*`                               |
| `contracts/.../users.ts` | `contracts/.../products.ts`                    |
| `GET/POST /users` + JWT  | `GET/POST /products` + JWT (or stricter rules) |
| `use-users.ts`           | `use-products.ts`                              |

So **`g resource` does not replace User or auth** — it **adds another row** in your architecture diagram, the same way User was done on day one.

### API preset

If the app was created with **`--preset api`** (no `apps/web`), **`g resource`** behaves the same as on dashboard/minimal: Prisma + Nest + contracts only. The MVP never generates Next.js pages or hooks.

---

## Part B — `stackforge add` (different job from `g resource`)

### What it means

- **`add`** = install an **optional capability module** into the project (infrastructure or cross-cutting feature).
- It is **not** a new DB “resource” with its own CRUD pages like Product.

Think: **Redis**, **email sending**, **file storage**, later **organizations** / **RBAC** — things that touch env, Docker, and shared config.

### Real example: Redis on the same `my-saas-app`

Your app already has:

```text
docker-compose.yml          ← postgres, api, web, studio (if Postgres + Docker)
.env.example
apps/api/src/…              ← no Redis client yet
```

**Target command:**

```bash
cd my-saas-app

stackforge add redis --dry-run

stackforge add redis
```

**Example “after” (illustrative — exact files TBD in Phase 4):**

| Area                                           | Change                                            |
| ---------------------------------------------- | ------------------------------------------------- |
| `docker-compose.yml`                           | **MODIFY** — add `redis` service, wire URL to API |
| `.env.example`                                 | **MODIFY** — `REDIS_URL=redis://redis:6379`       |
| `apps/api/src/redis/` or `apps/api/src/cache/` | **CREATE** — injectable client module             |
| `apps/api/src/app.module.ts`                   | **MODIFY** — import Redis module                  |
| `stackforge.json`                              | **MODIFY** — e.g. `"features": { "redis": true }` |

**No** `model Redis` in Prisma — Redis is not a domain entity like Product.

Run **`stackforge add redis` twice** → second run should **do nothing harmful** (idempotent): no duplicate compose services or env keys.

### `g resource` vs `add` — quick comparison

|                    | `stackforge g resource product` | `stackforge add redis`                  |
| ------------------ | ------------------------------- | --------------------------------------- |
| **Purpose**        | New **business entity** (CRUD)  | New **infrastructure module**           |
| **Prisma model**   | Yes (`Product`)                 | Usually no                              |
| **REST routes**    | Yes (`/products`)               | Usually no (internal client)            |
| **contracts**      | New Zod module                  | Maybe types for config only             |
| **Web UI**         | Optional table/forms            | Usually no                              |
| **Like existing…** | Copy **User** pattern           | Copy **Docker/Postgres** wiring pattern |

---

## Priority order (why `g` comes before `add` in the roadmap)

| Order | Command                   | On `my-saas-app`                                                     |
| ----- | ------------------------- | -------------------------------------------------------------------- |
| **1** | `stackforge g resource …` | Proves generators on real monorepo (Prisma + Nest + contracts; web UI later) |
| **2** | `--dry-run` + idempotency | Safe previews; safe re-runs for both `g` and `add`                   |
| **3** | `stackforge add …`        | First small module (e.g. redis) using the same safety rules          |
| **4** | Landing/docs              | Document commands only after CI smoke on a fresh 1.4.x app           |

You can use **`add`** without ever running **`g resource`**, but **`g resource`** is the main proof that StackForge understands **your** repo layout (the same layout **User** already uses).

---

## Try it yourself today (without Phase 4)

Phase 4 is not released yet. To **feel** what `g resource product` will automate:

1. Scaffold `my-saas-app` (1.4.2).
2. Open `apps/api/src/users/` and `packages/contracts/src/users.ts`.
3. Manually duplicate that pattern for `products` (rename, adjust fields).

Everything painful or repetitive in that exercise is what **`stackforge g resource product`** is meant to do in one step.

Diagnostics on the app you have **now**:

```bash
pnpm run doctor
pnpm run info
```

---

## See also

- [phase-4-build.md](./phase-4-build.md) — full Phase 4 priorities and exit criteria
- [ADR-001-api-contracts.md](./ADR-001-api-contracts.md) — why new resources must go through `packages/contracts`
- [tested-stack.md](./tested-stack.md) — CLI version that matches your templates
