# Migrating from `frontend/` + `backend/` to `apps/*`

StackForge **1.3.0+** generates:

```
apps/web/     # Next.js
apps/api/     # NestJS
packages/     # shared eslint-config, typescript-config, ui stub
```

Projects created with **1.2.x** use `frontend/` and `backend/` with `stackforge.json` schemaVersion **1**.

## Recommended approach

1. Generate a fresh app with the same preset/database and compare folder layout.
2. Move your domain code:
   - `backend/src/**` → `apps/api/src/**`
   - `frontend/src/**` → `apps/web/src/**`
3. Update root `package.json` scripts to use `pnpm --filter ./apps/api` and `./apps/web`.
4. Update `pnpm-workspace.yaml` to list `apps/*` and `packages/*`.
5. Replace `stackforge.json` with schemaVersion **2** and `apps: { "web": "apps/web", "api": "apps/api" }`.
6. Run `pnpm install`, `pnpm run build`, and `pnpm run doctor`.

There is no automated `stackforge upgrade` for layout yet (Phase 5).
