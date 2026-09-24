import type { ResourceField } from './types.js';

export type ResourceScalarType = ResourceField['type'];

const TYPE_ALIASES: Record<string, ResourceScalarType> = {
  string: 'string',
  int: 'int',
  integer: 'int',
  float: 'float',
  number: 'float',
  decimal: 'decimal',
};

export function normalizeFieldType(raw: string): ResourceScalarType {
  const key = raw.toLowerCase();
  const type = TYPE_ALIASES[key];
  if (!type) {
    throw new Error(
      `Unknown field type "${raw}". Use string, int, float, or decimal.`,
    );
  }
  return type;
}

export function prismaScalarType(type: ResourceScalarType): string {
  switch (type) {
    case 'string':
      return 'String';
    case 'int':
      return 'Int';
    case 'float':
      return 'Float';
    case 'decimal':
      return 'Decimal';
  }
}

export function zodPublicField(type: ResourceScalarType): string {
  switch (type) {
    case 'string':
      return 'z.string()';
    case 'int':
      return 'z.number().int()';
    case 'float':
      return 'z.number()';
    case 'decimal':
      return 'z.number()';
  }
}

export function zodCreateField(type: ResourceScalarType): string {
  switch (type) {
    case 'string':
      return 'z.string().min(1)';
    case 'int':
      return 'z.number().int()';
    case 'float':
      return 'z.number()';
    case 'decimal':
      return 'z.number()';
  }
}

export function zodUpdateField(type: ResourceScalarType): string {
  switch (type) {
    case 'string':
      return 'z.string().min(1).optional()';
    case 'int':
      return 'z.number().int().optional()';
    case 'float':
      return 'z.number().optional()';
    case 'decimal':
      return 'z.number().optional()';
  }
}

export function typescriptFieldType(type: ResourceScalarType): string {
  switch (type) {
    case 'string':
      return 'string';
    case 'int':
    case 'float':
    case 'decimal':
      return 'number';
  }
}
