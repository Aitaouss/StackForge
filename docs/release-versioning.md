# Release versioning (create-stackforge-app)

## Semver

| Change | Bump |
|--------|------|
| Template bugfix, docs, non-breaking CLI | **patch** (e.g. 1.0.10 → 1.0.11) |
| New generated files, new optional flags, Phase 1A–C trust work | **minor** (e.g. 1.0 → 1.1) |
| Breaking generated layout (`apps/` move), auth model change (cookie refresh) | **major** (e.g. 1.x → 2.0) |

## Before every npm publish

1. `pnpm run build` passes.
2. Locally (light): `pnpm run smoke:resource` and optionally `pnpm run smoke:sqlite`.
3. [Smoke CI](../.github/workflows/ci.yml) passes (SQLite presets + resource generator + PostgreSQL + Docker smoke).
4. Update [tested-stack.md](./tested-stack.md) if template dependency versions changed.
5. Release notes mention template/CLI changes (landing-only changes do not require npm publish when `paths-ignore` applies).

## stackforge.json

Each generate writes `stackforgeVersion` matching the published CLI version at generate time.
