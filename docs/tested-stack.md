# Tested stack matrix

Versions below are what **StackForge CI** uses when smoke-generating apps. Generated projects should align with this matrix for the matching `create-stackforge-app` release.

Update this file whenever template dependencies or CI Node/pnpm versions change.

## create-stackforge-app 1.2.0 (Phase 1C — Trust complete)

User CRUD (API + dashboard UI), profile and settings pages, change password, and Pino HTTP logging (requestId, route, status, duration, userId).

## create-stackforge-app 1.1.1 (Docker Postgres fix)

Fixes `docker compose up --build` for PostgreSQL: migrations in image, correct `dist/main.js` build, runtime dependencies.

## create-stackforge-app 1.1.0 (Phase 1A + 1B)

Generated apps include: Phase 1A auth/correctness fixes, Prisma migrations, Zod env validation, `/health`, throttling, Helmet, unit + e2e tests, and `.github/workflows/ci.yml`.

## create-stackforge-app 1.0.10 (baseline)

| Component | Version / note |
|-----------|----------------|
| Node.js (CI) | 22.x |
| pnpm (CI) | 9.x (via `packageManager` in generated root) |
| Next.js | 14.2.3 (`templates/frontend/package.json.ejs`) |
| React | 18.3.x |
| NestJS | 10.3.x |
| Prisma | 5.12.x |
| PostgreSQL (CI service) | 16 |
| SQLite | 3 (via Prisma file provider) |

## Policy

- Marketing and docs must not claim versions outside this matrix for a given CLI release.
- Phase 1B will bump template deps; this table must move in the same PR as template bumps.
- Optional future: `--next-channel stable|lts` (Phase 5).
