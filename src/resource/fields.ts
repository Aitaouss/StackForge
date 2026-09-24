import type { ResourceField } from './types.js';

const FIELD_PATTERN = /^([a-z][a-z0-9]*):string:required$/;

/** Prisma model always includes these; user must not redefine them via --field. */
const RESERVED_FIELD_NAMES = new Set(['id', 'createdAt', 'updatedAt']);

export function parseFieldDefinition(raw: string): ResourceField {
  const trimmed = raw.trim();
  const match = FIELD_PATTERN.exec(trimmed);
  if (!match) {
    throw new Error(
      `Invalid --field "${raw}". MVP supports only required string fields: name:string:required`,
    );
  }
  const name = match[1];
  if (RESERVED_FIELD_NAMES.has(name)) {
    throw new Error(
      `Field "${name}" is reserved (the generator adds id, createdAt, and updatedAt automatically).`,
    );
  }
  return {
    name,
    type: 'string',
    required: true,
  };
}

export function resolveFields(singular: string, fieldArgs: string[]): ResourceField[] {
  if (fieldArgs.length > 0) {
    const fields = fieldArgs.map(parseFieldDefinition);
    const names = new Set<string>();
    for (const field of fields) {
      if (names.has(field.name)) {
        throw new Error(`Duplicate field name "${field.name}".`);
      }
      names.add(field.name);
    }
    return fields;
  }

  if (singular === 'post') {
    return [
      { name: 'title', type: 'string', required: true },
      { name: 'content', type: 'string', required: true },
    ];
  }

  throw new Error(
    `No --field flags provided. Either pass --field definitions or use the built-in default for "post" (title, content).`,
  );
}
