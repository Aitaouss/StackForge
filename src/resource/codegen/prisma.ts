import type { GenerateResourceContext } from "../types.js";

export function renderPrismaModelBlock(ctx: GenerateResourceContext): string {
  const { naming, fields } = ctx;
  const { pascal, table } = naming;

  const scalarLines = fields.map((f) => `  ${f.name}     String`).join("\n");

  return `
model ${pascal} {
  id        String   @id @default(uuid())
${scalarLines}
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("${table}")
}
`.trimStart();
}

export function appendPrismaModel(
  schemaContent: string,
  modelBlock: string,
): string {
  const marker = `model ${modelBlock.match(/^model (\w+)/)?.[1]}`;
  if (schemaContent.includes(marker)) {
    throw new Error(`Prisma model already exists for this resource.`);
  }
  return `${schemaContent.trimEnd()}\n\n${modelBlock}\n`;
}
