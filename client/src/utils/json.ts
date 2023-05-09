export type Json = JsonPrimitive | JsonArray | JsonObject;

type JsonPrimitive = string | number | boolean | null;

type JsonArray = Array<Json>;

type JsonObject = {
  [k in string]: Json
};

export function readJson(input: string): Json|undefined {
  try {
    return JSON.parse(input) as Json;
  }
  catch {
    return undefined;
  }
}

export function isJsonArray(input: Json): input is JsonArray {
  return Array.isArray(input);
}

export function isJsonObject(input: Json): input is JsonObject {
  return typeof input === 'object' && !Array.isArray(input) && input !== null;
}
