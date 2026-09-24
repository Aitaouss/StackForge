import {
  zodCreateField,
  zodPublicField,
  zodUpdateField,
} from '../field-types.js';
import type { GenerateResourceContext } from '../types.js';

export function renderContractsFile(ctx: GenerateResourceContext): string {
  const { naming, fields } = ctx;
  const { pascal, singular } = naming;

  const publicFields = fields
    .map((f) => `  ${f.name}: ${zodPublicField(f.type)},`)
    .join('\n');

  const createRequired = fields
    .filter((f) => f.required)
    .map((f) => `  ${f.name}: ${zodCreateField(f.type)},`)
    .join('\n');

  const updateOptional = fields
    .map((f) => `  ${f.name}: ${zodUpdateField(f.type)},`)
    .join('\n');

  return `import { z } from 'zod';

export const ${singular}PublicSchema = z.object({
  id: z.string(),
${publicFields}
});

export type ${pascal}Public = z.infer<typeof ${singular}PublicSchema>;

export const ${singular}Schema = ${singular}PublicSchema.extend({
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ${pascal} = z.infer<typeof ${singular}Schema>;

export const create${pascal}InputSchema = z.object({
${createRequired}
});

export type Create${pascal}Input = z.infer<typeof create${pascal}InputSchema>;

export const update${pascal}InputSchema = z.object({
${updateOptional}
});

export type Update${pascal}Input = z.infer<typeof update${pascal}InputSchema>;
`;
}
