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
