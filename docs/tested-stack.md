# Tested stack matrix

Versions below are what **StackForge CI** uses when smoke-generating apps. Generated projects should align with this matrix for the matching `create-stackforge-app` release.

Update this file whenever template dependencies or CI Node/pnpm versions change.

## create-stackforge-app 1.5.0

**Phase 4 — Resource generator (MVP)**

- From a generated project root: **`pnpm exec stackforge g resource <name>`** or **`pnpm run generate -- resource <name>`** (alias **`generate resource`**).
- Requires **`create-stackforge-app` ^1.5.0** in the project (new scaffolds; upgrade devDependency on older projects).
- **`--dry-run`**, **`--field name:string:required`** only; default fields for **`post`** (`title`, `content`).
- **API-only** in MVP: Prisma model + Nest CRUD + `packages/contracts`; no web UI.
- Smoke: **`pnpm run smoke:resource`** (`scripts/smoke-generate-resource.mjs`).

## create-stackforge-app 1.4.2

**First-run Prisma and diagnostics patch**

- Fresh installs generate the Prisma client automatically; root `predev` and `prebuild` provide safety nets when lifecycle scripts are skipped.
- Root `db:setup` generates the Prisma client and applies development migrations.
- Generated projects expose `pnpm run doctor` and `pnpm run info` through a compatible `create-stackforge-app` development dependency.
- Docker builders ignore root lifecycle scripts and generate Prisma only after the schema is copied.
- Smoke tests verify the install-generated Prisma client and the generated-project diagnostics scripts.

## create-stackforge-app 1.4.1

**Docker / contracts patch**

- Fixes generated **Docker** builds with `packages/contracts` (no `prepare` on prod install; explicit contract builds; web runner `--ignore-scripts` + copied `dist`).
- **Prisma Studio** in Compose: dedicated **`studio`** image stage, Postgres `sslmode=disable`, Studio on **127.0.0.1:5555**.
- **API** production image: separate **`prod-deps`** install stage.
- CI: **`smoke-docker-generated-app.mjs`** (compose build, API `/health`, Studio `User.findMany`).
- Local dev: root **`predev`** + **`contracts` watch** during `pnpm dev`.

## create-stackforge-app 1.4.0 (Phase 3 — Contracts)

- **`packages/contracts`**: Zod schemas + inferred types for auth and users.
- Nest DTOs via **nestjs-zod**; web imports types from contracts (no duplicate `User` / `AuthUser` in services).
- See [docs/ADR-001-api-contracts.md](./ADR-001-api-contracts.md).

## create-stackforge-app 1.3.1

- Fix generated **dashboard profile/settings** routes (`/dashboard/profile`, `/dashboard/settings`).

## create-stackforge-app 1.3.0 (Phase 2 — Architecture)

- **`apps/web` + `apps/api`** monorepo; manifest **schema v2**.
- Presets: **`dashboard`**, **`minimal`**, **`api`** (smoke-tested in CI).
- **`stackforge doctor`** and **`stackforge info`**.

## create-stackforge-app 1.2.0 (Phase 1C)

User CRUD (API + dashboard UI), profile and settings pages, change password, and Pino HTTP logging (requestId, route, status, duration, userId).

## create-stackforge-app 1.1.1 (Docker Postgres fix)

Fixes `docker compose up --build` for PostgreSQL: migrations in image, correct `dist/main.js` build, runtime dependencies.

## create-stackforge-app 1.1.0 (Phase 1A + 1B)

Generated apps include: Phase 1A auth/correctness fixes, Prisma migrations, Zod env validation, `/health`, throttling, Helmet, unit + e2e tests, and `.github/workflows/ci.yml`.

## Baseline template versions (current)

| Component                        | Version / note                                 |
| -------------------------------- | ---------------------------------------------- |
| Node.js (CI)                     | 22.x                                           |
| pnpm (CI)                        | 9.x (via `packageManager` in generated root)   |
| Next.js                          | 14.2.3 (`templates/web/package.json.ejs`)      |
| React                            | 18.3.x                                         |
| NestJS                           | 10.3.x                                         |
| Prisma                           | 5.12.x (resolved to 5.22.x in smoke lockfiles) |
| PostgreSQL (CI service / Docker) | 16                                             |
| SQLite                           | 3 (via Prisma file provider)                   |

## Policy

- Marketing and docs must not claim versions outside this matrix for a given CLI release.
- Template dependency bumps must update this file in the same PR.
- Optional future: `--next-channel stable|lts` (Phase 5).
