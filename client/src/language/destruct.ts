import { JsonObject } from "../utils/json";
import { Json } from "../utils/json";
import { isJsonArray } from "../utils/json";
import { isJsonObject } from "../utils/json";
import { JsonArray } from "../utils/json";
import { Data } from "../utils/union";
import { ArrayType, RecordType, Type } from "./types";

type TypedView = Data<{
  number: {
    value: number;
  },
  string: {
    value: string;
  },
  boolean: {
    value: boolean;
  },
  record: {
    value: JsonObject,
    type: RecordType,
  },
  array: {
    value: JsonArray,
    type: ArrayType,
  }
}>;

export function toTypedView(type: Type, value: Json): TypedView {
  if (type.kind === 'record' && isJsonObject(value)) {
    return {
      kind: 'record',
      type,
      value,
    }
  }
  else if (type.kind === 'array' && isJsonArray(value)) {
    return {
      kind: 'array',
      type,
      value
    }
  }
  else if (type.kind === 'number' && typeof value === 'number') {
    return {
      kind: 'number',
      value
    }
  }
  else if (type.kind === 'string' && typeof value === 'string') {
    return {
      kind: 'string',
      value
    }
  }
  else if (type.kind === 'boolean' && typeof value === 'boolean') {
    return {
      kind: 'boolean',
      value
    }
  }

  throw new Error('toTypedView expects value to match the type');
}
