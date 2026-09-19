# Generated project file ownership

StackForge classifies files in **generated applications** so future `stackforge diff` and `stackforge upgrade` can update infrastructure without touching your product code.

## Categories

| Category | Meaning | Examples |
|----------|---------|----------|
| **Managed** | StackForge may replace or patch on upgrade | `.stackforge/`, root ESLint/TSConfig bases (when added), `.github/workflows/ci.yml` (when generated) |
| **Extended** | Scaffold structure; user extensions expected | `backend/src/auth/*`, auth-related frontend flows |
| **User** | Never modified by StackForge | Domain modules, resources from `stackforge g resource`, custom business logic |

## Generated resources (Phase 4+)

After `stackforge g resource`, that resource tree is **user-owned**. Upgrade may add adjacent tooling but must not rewrite generated resource business logic.

## Checksums (future)

Phase 5 may store SHA-256 checksums of managed files under `.stackforge/` to power `stackforge diff`.

## See also

- [Phases-stack-forge.md](../Phases-stack-forge.md) — Phase 0–5 roadmap
- Generated `AGENTS.md` in each new project (summary for humans and AI tools)
