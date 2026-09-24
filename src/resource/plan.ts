import path from "path";
import type { GenerateResourceContext, PlannedFileChange } from "./types.js";

export function buildResourcePlan(
  ctx: GenerateResourceContext,
): PlannedFileChange[] {
  const { projectRoot, apiRoot, contractsRoot, naming } = ctx;
  const apiSrc = path.join(apiRoot, "src");
  const resourceDir = path.join(apiSrc, naming.plural);

  const rel = (absolute: string): string =>
    path.relative(projectRoot, absolute);

  return [
    {
      action: "CREATE",
      path: rel(path.join(resourceDir, `${naming.plural}.module.ts`)),
    },
    {
      action: "CREATE",
      path: rel(path.join(resourceDir, `${naming.plural}.controller.ts`)),
    },
    {
      action: "CREATE",
      path: rel(path.join(resourceDir, `${naming.plural}.service.ts`)),
    },
    {
      action: "CREATE",
      path: rel(
        path.join(resourceDir, "dto", `create-${naming.singular}.dto.ts`),
      ),
    },
    {
      action: "CREATE",
      path: rel(
        path.join(resourceDir, "dto", `update-${naming.singular}.dto.ts`),
      ),
    },
    {
      action: "CREATE",
      path: rel(path.join(resourceDir, `${naming.plural}.service.spec.ts`)),
    },
    {
      action: "CREATE",
      path: rel(path.join(contractsRoot, "src", `${naming.plural}.ts`)),
    },
    {
      action: "MODIFY",
      path: rel(path.join(apiRoot, "prisma", "schema.prisma")),
    },
    { action: "MODIFY", path: rel(path.join(apiSrc, "app.module.ts")) },
    {
      action: "MODIFY",
      path: rel(path.join(contractsRoot, "src", "index.ts")),
    },
    { action: "MODIFY", path: rel(path.join(projectRoot, "stackforge.json")) },
  ];
}
