# ADR 001: API contract pipeline (Phase 3)

## Status

Accepted — Phase 3 (2026).

## Context

Generated apps duplicated API shapes: Nest **class-validator** DTOs on the server and hand-written interfaces in `apps/web/src/services/`. That drifted quickly and blocked safe refactors.

## Decision

Use **contract-first (Option A)**:

```text
packages/contracts  (Zod schemas + inferred types)
        │
        ├─► apps/api     — DTOs via nestjs-zod `createZodDto(schema)`
        └─► apps/web     — `import type` from contracts; HTTP via services (api-client later)
```

- **Single source of truth:** auth and users request/response shapes live in `packages/contracts`.
- **Validation:** Nest uses `ZodValidationPipe` + Zod DTOs derived from the same schemas — not parallel class-validator rules on those endpoints.
- **Web rule:** Do not define duplicate `User` / `AuthUser` interfaces in `apps/web`; import types from the workspace `contracts` package.

## Consequences

- Root `build` / `typecheck` and CI smoke build `packages/contracts` before apps.
- OpenAPI remains on `/docs`; full schema generation from Zod may improve in a follow-up.
- **Forbidden long-term:** maintaining Zod + class-validator + hand-written client types for the same endpoint.

## Alternatives considered

- **Server-first (OpenAPI → generated client):** rejected for v1 of Phase 3 to avoid codegen churn in every generated repo; may revisit for `api-client` automation.
