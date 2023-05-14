import { Data } from "../utils/union";

export type RecordEntry = [string, Type];

export interface RecordType {
  items: Map<string, Type>
}

export interface ArrayType {
  item: Type
}

export type Type = Data<{
  number: {},
  string: {},
  boolean: {},
  record: RecordType,
  array: ArrayType,
}>;

export type TypeObject = Data<{
  number: {},
  string: {},
  boolean: {},
  record: {
    items: Record<string, TypeObject>
  },
  array: {
    item: TypeObject
  }
}>;

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
