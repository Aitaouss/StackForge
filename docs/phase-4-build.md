# Phase 4 — BUILD

This document explains **Phase 4** of StackForge in plain language: what it is, why it matters after **create-stackforge-app** (Phases 0–3), and how to ship it in a sensible order.

**Canonical roadmap:** [Phases-stack-forge.md](../Phases-stack-forge.md) (full spec, exit criteria, and out-of-scope items).

**Where you are today (after 1.4.x):**

- **Generate** — `npx create-stackforge-app` scaffolds a monorepo (presets, contracts, auth Docker, CI).
- **Maintain (partial)** — `pnpm run doctor` / `info` inside generated projects.
- **Extend** — not shipped yet. Phase 4 is **Extend**.

---

,

## The three pillars (target)

| Pillar       | Meaning                | Example                                   |
| ------------ | ---------------------- | ----------------------------------------- |
| **Generate** | Bootstrap once         | `create-stackforge-app`                   |
| **Extend**   | Add features over time | `stackforge g resource`, `stackforge add` |
| **Maintain** | Diagnose and evolve    | `doctor`, `diff`, `upgrade` (Phase 5)     |

Phase 4 makes **Extend** real. Without it, StackForge is a very good starter; with it, StackForge stays useful **after day one**.

---

## What Phase 4 is not

- Replacing **create** or re-scaffolding the whole app on every release.
- A **marketplace** of third-party plugins (later / optional).
- **`stackforge upgrade`** or full drift detection (that is **Phase 5**).
- A **`saas` preset** until orgs, RBAC, email, and related modules actually work (see [Phases-stack-forge.md §4.5](../Phases-stack-forge.md)).

---

## Core idea: one domain model, many outputs

Today, shared types live in **`packages/contracts`** (Phase 3). Phase 4 applies the same “single source of truth” idea to **new domain resources** you add _after_ scaffolding.

For a resource such as `product`, one command should drive (as appropriate):

| Layer              | What gets generated or updated                        |
| ------------------ | ----------------------------------------------------- |
| **Database**       | Prisma model + migration                              |
| **API**            | Nest module, service, controller, validation, Swagger |
| **Contracts**      | Zod schemas + inferred types                          |
| **Web** (optional) | React Query hooks, table/forms, search/pagination     |
| **Tests**          | Smoke coverage for the new surface                    |

The CLI is **not** meant to dump unrelated CRUD files that drift from each other. One **field/capability definition** should fan out to aligned API, contracts, and UI.

Example (future interactive flow — from the roadmap):

```bash
stackforge g resource product
```

Prompts might cover fields, CRUD capabilities, UI pieces, and auth rules. Non-interactive flags (`--field`, `--crud`, `--api-only`, etc.) are required for CI and scripts — see [Phases-stack-forge.md §4.1](../Phases-stack-forge.md).

---

## Recommended delivery order

Ship Phase 4 in **thin vertical slices**. Each row below is a milestone you can merge, smoke-test, and document before taking the next.

| Priority | Deliverable                                                 | Why it matters                                                                                                                                                                                                              |
| -------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1**    | **`stackforge g resource <name>`** — one **vertical slice** | Proves the generator pipeline on a real app: Prisma → Nest → **contracts** → (optional) web list/detail. Without this slice, `add` and presets have nothing to plug into.                                                   |
| **2**    | **Dry-run + idempotency**                                   | `stackforge g resource … --dry-run` prints `CREATE` / `MODIFY` paths without writing. Re-running `add` or `generate` must **not** duplicate imports, env keys, or Docker services. Trust requires predictable, safe writes. |
| **3**    | **First `stackforge add <module>`**                         | Smaller than a full resource generator (e.g. **redis**, **email** stub): manifest flag, env docs, idempotent install. Becomes the **pattern** for oauth, queue, storage, orgs, RBAC later.                                  |
| **4**    | **Marketing / docs**                                        | Mention **`stackforge g resource`** on the landing site and `/docs` **only after** CI smoke passes on a generated app. Avoid advertising commands that do not exist or break on fresh scaffolds.                            |

Priorities **1–2** are the minimum credible **BUILD** release. Priority **3** scales the module story; **4** keeps npm and marketing aligned with [docs/tested-stack.md](./tested-stack.md).

---

## Priority 1 in detail: `stackforge g resource`

**Goal:** From an existing generated project (manifest v2, contracts package, auth baseline), add a new resource end-to-end.

**Suggested first slice (smallest useful demo):**

- One model (e.g. `Post` or `Product`) with a few fields.
- Nest CRUD behind JWT (and admin rules if dashboard preset).
- Contract types consumed by API DTOs and web client.
- Optional: simple web list page on **dashboard** / **minimal** presets; skip web on **`api`** preset or with `--api-only`.

**Ownership:** Generated resource code is **user-owned**. StackForge must not rewrite it on upgrade. See [file-ownership.md](./file-ownership.md) and manifest registration (`userPaths` / feature slug) in the roadmap.

**Exit signal for slice 1:**

- Fresh app from `create-stackforge-app@latest` → run generator → `pnpm dev` → API + UI work.
- CI job: generate resource in smoke temp dir → lint/typecheck/test (same spirit as current smoke scripts).

---

## Priority 2 in detail: dry-run and idempotency

**Dry-run**

```bash
stackforge g resource product --dry-run
stackforge add redis --dry-run
```

Output should list paths under `apps/`, `packages/`, and `apps/api/prisma/` with action **CREATE** or **MODIFY**, with **no filesystem writes**.

**Idempotency**

- Running the same `add` twice must not append duplicate env entries, compose services, or module imports.
- Generators should detect existing resource names and fail clearly (or no-op with a message), not corrupt the tree.

These rules match the product principles in [Phases-stack-forge.md](../Phases-stack-forge.md): _dry-run before write_ and _idempotent modifiers_.

---

## Priority 3 in detail: `stackforge add`

**Goal:** Opt-in **modules**, not bloated defaults.

Examples from the roadmap: `oauth`, `email`, `redis`, `queue`, `storage`, `organizations`, `rbac`.

Each module should:

- Set or extend **manifest** feature flags.
- Document **env** vars in `.env.example` / README.
- Include **tests** or smoke steps where feasible.
- Install **idempotently** (see priority 2).

Pick **one small module** first (e.g. redis: client helper + env + compose snippet) before larger ones (organizations, RBAC).

---

## Priority 4 in detail: marketing and docs

Only after priorities **1–2** (and ideally **3**) pass CI:

- Update landing copy, chatbot, and `/docs` with real command examples.
- Bump **CLI_VERSION** / release notes when the generator ships on npm.
- Extend [tested-stack.md](./tested-stack.md) with generator version matrix and smoke coverage.

Do not enable **`--preset saas`** on create until the roadmap’s org/RBAC/email requirements are met.

---

## Relationship to Phase 5 (Maintain)

Phase 4 adds **user-owned** trees (resources, some module files). Phase 5 adds:

```text
stackforge doctor  →  stackforge diff  →  stackforge upgrade
```

- **diff** — compare managed scaffold files vs expected templates.
- **upgrade** — patch **managed** files only; never overwrite resource business logic from Phase 4.

Design Phase 4 generators with that boundary in mind ([file-ownership.md](./file-ownership.md)).

---

## Phase 4 exit criteria (summary)

From [Phases-stack-forge.md §4](../Phases-stack-forge.md):

- Demo-quality: `stackforge g resource product` on a clean machine in under ~2 minutes (after documenting dry-run).
- Non-interactive `g resource` with `--field` flags covered by at least one CI test.
- One `stackforge add` module with idempotency tests.
- Generated resources documented as **user-owned**; upgrade policy clear.

---

## Suggested first PR (when you start coding)

1. CLI subcommand wiring: `stackforge g resource <name>` (alias `generate resource`).
2. Minimal field definition (start with flags, not full interactive wizard).
3. Output: Prisma migration + Nest module + contracts slice + manifest entry.
4. Smoke script: generate `post` on a temp dashboard app → build API → optional e2e hit.

Branch naming convention (examples): `feat/phase-4-g-resource-post`, `feat/stackforge-add-redis`.

---

## See also

- [Phases-stack-forge.md](../Phases-stack-forge.md) — full Phase 4 spec (RBAC, orgs, saas preset)
- [ADR-001-api-contracts.md](./ADR-001-api-contracts.md) — contracts pattern generators must follow
- [file-ownership.md](./file-ownership.md) — managed vs user files
- [tested-stack.md](./tested-stack.md) — versions and smoke policy for releases
