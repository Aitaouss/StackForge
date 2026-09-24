const RESERVED = new Set([
  'auth',
  'user',
  'users',
  'health',
  'prisma',
  'common',
  'config',
  'app',
]);

const NAME_PATTERN = /^[a-z][a-z0-9]*$/;

export function validateResourceName(name: string): void {
  if (!NAME_PATTERN.test(name)) {
    throw new Error(
      `Invalid resource name "${name}". Use lowercase letters and numbers only (e.g. post, product).`,
    );
  }
  if (RESERVED.has(name) || RESERVED.has(pluralize(name))) {
    throw new Error(`Resource name "${name}" is reserved or conflicts with built-in modules.`);
  }
}

export function pluralize(singular: string): string {
  if (singular.endsWith('s')) {
    return `${singular}es`;
  }
  if (singular.endsWith('y') && singular.length > 1 && !/[aeiou]y$/.test(singular)) {
    return `${singular.slice(0, -1)}ies`;
  }
  return `${singular}s`;
}

export function toPascalCase(singular: string): string {
  return singular.charAt(0).toUpperCase() + singular.slice(1);
}

export function resourceNaming(singular: string) {
  const plural = pluralize(singular);
  const pascal = toPascalCase(singular);
  return {
    singular,
    plural,
    pascal,
    table: plural,
  };
}
