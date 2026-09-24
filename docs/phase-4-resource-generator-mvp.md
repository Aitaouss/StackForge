# Phase 4 — Resource generator MVP

This is the **implementation spec** for the first shippable slice of Phase 4: **`stackforge generate resource`** (alias **`stackforge g resource`**).

**Audience:** maintainers implementing the CLI.  
**Related:** [phase-4-priority-1-explained.md](./phase-4-priority-1-explained.md) (user-facing examples) · [phase-4-build.md](./phase-4-build.md) · [file-ownership.md](./file-ownership.md)

**Status:** Shipped in **create-stackforge-app 1.5.0** (publish after CI green on `main`).

---

## Goal

From an **existing** StackForge project (created with **1.4.x+**, manifest **schema v2**), add a **new CRUD resource** in one command — the same cross-cutting wiring as **User**, without hand-copying `users/` → `posts/`.

**Canonical demo resource for CI and docs:** **`post`** (fields **`title`**, **`content`**).  
**`product`** remains a documentation example only until a later slice adds richer field types (price, stock, enums).

---

## Non-goals (MVP)

| Out of scope for MVP                                         | Later                                                                  |
| ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| Interactive field wizard                                     | Phase 4.1 full UX in [Phases-stack-forge.md](../Phases-stack-forge.md) |
| Web UI (pages, React Query hooks)                            | Slice 2; MVP is API + contracts + Prisma only                          |
| `stackforge add` modules                                     | Separate milestone after generator proves stable                       |
| Relations (`categoryId:relation<Category>`)                  | After scalar fields work                                               |
| Permissions beyond “same as User” (JWT on all routes)        | RBAC module later                                                      |
| `stackforge diff` / `upgrade`                                | Phase 5                                                                |
| Updating **create-stackforge-app** templates to include Post | Create still ships **User** only                                       |

---

## Command surface (MVP)

Run from **project root** (where `stackforge.json` lives):

```bash
pnpm exec stackforge generate resource <name>
pnpm exec stackforge g resource <name>          # alias
pnpm run generate -- resource <name>            # via root package script
```

Requires **`create-stackforge-app` ^1.5.0** as a project devDependency (included on new scaffolds).

### Required behavior

| Rule                  | Detail                                                                       |
| --------------------- | ---------------------------------------------------------------------------- |
| **Working directory** | Must contain `stackforge.json` with `schemaVersion: 2` and `apps.api`        |
| **Name**              | CLI arg: **singular**, lowercase, `[a-z][a-z0-9]*` (e.g. `post`, `product`) |
| **Plurals**           | Derive table/route/module folder: `post` → `posts`, `Post`, `/posts`         |
| **Collision**         | Fail if model or module already exists (e.g. `user`, `post` after first run) |
| **Reserved**          | Reject `user`, `auth`, and other built-in names (explicit list in code)      |

### Flags (MVP)

| Flag               | Purpose                                                             |
| ------------------ | ------------------------------------------------------------------- |
| `-c, --cwd <path>` | Project root (default: `process.cwd()`)                             |
| `--dry-run`        | Print planned **CREATE** / **MODIFY** paths; **no writes**          |
| `--field <def>`    | Repeatable; MVP supports **`name:string:required`** only (no optional fields) |

**MVP field definitions** (fixed set for v1 — expand later):

```text
--field "title:string:required"
--field "content:string:required"
```

If no `--field` flags: for **`post`** only, apply default fields **`title`**, **`content`** (both required strings). Other names require at least one `--field` or fail with a clear message.

**Example (CI / docs):**

```bash
cd my-saas-app
pnpm exec stackforge g resource post --dry-run
pnpm exec stackforge g resource post
pnpm --filter ./apps/api exec prisma migrate dev --name add_post
pnpm --filter ./apps/api run lint
pnpm --filter ./apps/api run typecheck
pnpm --filter ./apps/api run test
```

**Example (custom name + fields):**

```bash
pnpm exec stackforge g resource note \
  --field "title:string:required" \
  --field "body:string:required"
```

---

## Reference pattern: copy User, not invent layout

Generated apps already include **User**. The generator **mirrors** that layout.

| User (create template)              | New resource (`post`)             |
| ----------------------------------- | --------------------------------- |
| `model User` in `schema.prisma`     | `model Post` appended             |
| `apps/api/src/users/`               | `apps/api/src/posts/`             |
| DTOs from contracts / nestjs-zod    | Same for `posts`                  |
| `packages/contracts/src/users.ts`   | `packages/contracts/src/posts.ts` |
| `UsersModule` in `app.module.ts`    | `PostsModule` registered          |
| JWT `@UseGuards(AuthGuard)` on CRUD | Same default in MVP               |

Implementation approach:

1. **Generator templates** under repo `templates/generators/resource/` (or programmatic file writers), **not** changes to default create templates.
2. Read **manifest** (`stackforge.json`) for `apps.api`, preset, features.
3. Write files; patch existing files (`schema.prisma`, `app.module.ts`, `contracts/src/index.ts`, `stackforge.json`).

---

## Files: CREATE / MODIFY (`post` example)

Paths assume default layout `apps/api`, `packages/contracts`.

### CREATE

```text
apps/api/src/posts/
├── posts.module.ts
├── posts.controller.ts
├── posts.service.ts
└── dto/
    ├── create-post.dto.ts
    └── update-post.dto.ts

packages/contracts/src/posts.ts

apps/api/prisma/migrations/<timestamp>_add_post/migration.sql   # or prompt migrate dev
```

(Exact migration strategy: MVP may append model and run **`prisma migrate dev --name add_post`** via docs/smoke, or ship SQL stub — pick one in implementation PR and document in [tested-stack.md](./tested-stack.md).)

### MODIFY

```text
apps/api/prisma/schema.prisma              # append model Post
apps/api/src/app.module.ts                 # import PostsModule
packages/contracts/src/index.ts            # export posts
stackforge.json                            # register resource (see below)
```

### `--dry-run` output (example)

```text
CREATE  apps/api/src/posts/posts.module.ts
CREATE  apps/api/src/posts/posts.controller.ts
CREATE  apps/api/src/posts/posts.service.ts
CREATE  apps/api/src/posts/dto/create-post.dto.ts
CREATE  apps/api/src/posts/dto/update-post.dto.ts
CREATE  packages/contracts/src/posts.ts
MODIFY  apps/api/prisma/schema.prisma
MODIFY  apps/api/src/app.module.ts
MODIFY  packages/contracts/src/index.ts
MODIFY  stackforge.json
```

No `MODIFY` on `users/` or auth — **user-owned vs managed** rules in [file-ownership.md](./file-ownership.md).

---

## Prisma model (MVP default for `post`)

```prisma
model Post {
  id        String   @id @default(uuid())
  title     String
  content   String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("posts")
}
```

Align naming with existing `User` (`@@map`, `@map("created_at")`).

---

## Contracts (MVP)

`packages/contracts/src/posts.ts` — same shapes as users, adapted fields:

- `postSchema` / `Post` type (include `createdAt`, optional `updatedAt` as ISO strings if matching User pattern)
- `createPostInputSchema`, `updatePostInputSchema`
- Export from `index.ts`

Nest DTOs use **nestjs-zod** like existing User DTOs.

---

## API (MVP)

- Base path: **`/posts`**
- Operations: **list, get by id, create, update, delete** (parity with users controller scope)
- **Auth:** `AuthGuard` + `@ApiBearerAuth()` on all routes (same as users)
- **Swagger:** `@ApiTags('posts')`

No admin-only nuance in MVP unless User already distinguishes admin routes — match users policy.

---

## Manifest extension (MVP)

Append to `stackforge.json` (exact schema TBD in PR; example):

```json
{
  "generatedResources": [
    {
      "name": "post",
      "plural": "posts",
      "addedAt": "2026-09-22",
      "stackforgeVersion": "1.5.0"
    }
  ]
}
```

Used later for **diff/upgrade** and collision detection. MVP must at least **detect duplicate `post`**.

---

## CLI wiring (repo)

Extend `src/stackforge.ts`:

```text
stackforge
├── doctor          # exists
├── info            # exists
└── generate (g)
    └── resource <name>
```

- Reuse manifest helpers from `src/manifest.ts`.
- Generator entry: e.g. `src/generators/resource/` or `src/commands/generate-resource.ts`.
- **Do not** register `generate` on `create-stackforge-app` bin — only **`stackforge`** inside generated projects (and maintainer dev: `node bin/stackforge.js` from repo when testing against temp app).

---

## Smoke test (required before release)

Add script e.g. `scripts/smoke-generate-resource.mjs`:

1. `node bin/create-stackforge-app.js smoke-post -y --database sqlite --no-docker --cwd $TMP`
2. `pnpm install` in generated app
3. `pnpm run db:setup`
4. `pnpm exec stackforge g resource post` in generated app (CI links local `create-stackforge-app` before install)
5. `pnpm --filter ./apps/api exec prisma migrate dev --name add_post`
6. `pnpm --filter ./apps/api run lint && typecheck && test`
7. Optional: hit `GET /posts` in e2e with auth token

Wire into CI on same job as existing sqlite smoke (or follow-up job).

---

## Release checklist

- [ ] MVP merged to `main`
- [ ] [tested-stack.md](./tested-stack.md) — generator row for **1.5.0**
- [ ] [phase-4-priority-1-explained.md](./phase-4-priority-1-explained.md) — note **`post`** is CI canonical; **`product`** example unchanged
- [ ] Generated app **devDependency** `create-stackforge-app` range includes version with generator (or document `npx stackforge` via package bin after publish)
- [ ] Landing/docs: document **`g resource`** only after smoke green
- [ ] Tag + npm **1.5.0** (minor — new command)

---

## Implementation task order (suggested PRs)

| PR    | Content                                                                                 |
| ----- | --------------------------------------------------------------------------------------- |
| **1** | CLI skeleton: `g resource`, `--dry-run`, `--cwd`, name validation, dry-run printer only |
| **2** | Prisma + contracts + Nest module generation for default **`post`**                      |
| **3** | `--field` parsing (string + required); generic resource names                           |
| **4** | `stackforge.json` registration + collision checks                                       |
| **5** | Smoke script + CI                                                                       |
| **6** | Docs + version bump **1.5.0**                                                           |

Single large PR is acceptable if review prefers one vertical slice.

---

## Open decisions (resolve in PR 1)

1. **Migration:** generator runs `migrate dev` vs only edits schema and leaves migrate to user — prefer **schema + manual/db:setup in smoke** for CI simplicity.
2. **Bin in generated apps:** today `stackforge` comes from `create-stackforge-app` devDependency — generator ships in same package; bump **`^1.5.0`** in template when releasing.
3. **E2E:** extend existing e2e with authenticated `POST /posts` or unit-only for MVP.

Default recommendations: **schema only + smoke runs db:setup**; **unit + existing e2e pattern**; **post-only defaults without --field**.

---

## See also

- [ADR-001-api-contracts.md](./ADR-001-api-contracts.md)
- [Phases-stack-forge.md §4.1](../Phases-stack-forge.md)
- Templates reference: `templates/api/src/users/`, `templates/packages/contracts/src/users.ts.ejs`
