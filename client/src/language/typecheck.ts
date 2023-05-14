import { Json, isJsonArray, isJsonObject } from "../utils/json";
import { RecordEntry, Type } from "./types";

function checkType(json: Json, type: Type): boolean {
  if (isJsonArray(json) && type.kind === 'array') {
    for (const item of json) {
      if (!checkType(item, type.item)) {
        return false;
      }
    }
    return true;
  }
  else if (isJsonObject(json) && type.kind === 'record') {
    const handledKeys = new Set<string>();
    for (const [key, value] of Object.entries(json)) {
      const maybeType = type.items.get(key);
      if (maybeType === undefined) {
        // TODO: error messages
        return false;
      }

      if (!checkType(value, maybeType)) {
        return false;
      }

      handledKeys.add(key);
    }

    for (const key of type.items.keys()) {
      if (!handledKeys.has(key)) {
        return false;
      }
    }

    return true;
  }
  else if (typeof json === 'number' && type.kind === 'number') {
    return true;
  }
  else if (typeof json === 'string' && type.kind === 'string') {
    return true;
  }
  else if (typeof json === 'boolean' && type.kind === 'boolean') {
    return true;
  }

  return false;
}

export function inferType(json: Json): Type|undefined {
  if (isJsonArray(json)) {
    if (json.length === 0) {
      return {
        kind: 'array',
        item: {
          // TODO: figure out a better behaviour here, not sure if I want global inference though.
          kind: 'number'
        }
      }
    }

    const maybeType = inferType(json[0]);
    if (maybeType === undefined) {
      return undefined;
    }

    for (let i = 1; i < json.length; i++) {
      if (!checkType(json[i], maybeType)) {
        return undefined;
      }
    }

    return {
      kind: 'array',
      item: maybeType
    }
  }
  else if (isJsonObject(json)) {
    const entries: RecordEntry[] = [];

    for (const [key, value] of Object.entries(json)) {
      const maybeType = inferType(value);
      if (maybeType === undefined) {
        return undefined;
      }

      entries.push([key, maybeType]);
    }

    return {
      kind: 'record',
      items: new Map(entries)
    }
  }
  else if (typeof json === 'number') {
    return {
      kind: 'number'
    }
  }
  else if (typeof json === 'string') {
    return {
      kind: 'string'
    }
  }
  else if (typeof json === 'boolean') {
    return {
      kind: 'boolean'
    }
  }
  else {
    return undefined;
  }
}