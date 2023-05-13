import { Kinds, Union } from "../utils/union";

export type RecordEntry = [string, Type];

export type Type = Union<Kinds<{
  number: {},
  string: {},
  boolean: {},
  record: {
    items: Map<string, Type>
  },
  array: {
    item: Type
  }
}>>;

export type TypeObject = Union<Kinds<{
  number: {},
  string: {},
  boolean: {},
  record: {
    items: Record<string, TypeObject>
  },
  array: {
    item: TypeObject
  }
}>>;

export function toTypeObject(type: Type): TypeObject {
  switch (type.kind) {
    case 'number':
    case 'string':
    case 'boolean':
      return type;

    case 'array':
      return {
        kind: 'array',
        item: toTypeObject(type.item)
      }

    case 'record':
      return {
        kind: 'record',
        items: Object.fromEntries([...type.items.entries()].map(([key, value]) => [key, toTypeObject(value)]))
      }
  }
}

export function isPrimitiveType(type: Type): boolean {
  return type.kind === 'number' || type.kind === 'string' || type.kind === 'boolean';
}
