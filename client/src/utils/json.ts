export type Json = JsonPrimitive | JsonArray | JsonObject;

type JsonPrimitive = string | number | boolean | null;

type JsonArray = Array<Json>;

type JsonObject = {
  [k in string]: Json
};

function readJson(input: string): Json|undefined {
  try {
    return JSON.parse(input) as Json;
  }
  catch {
    return undefined;
  }
}
