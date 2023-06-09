import { array, num, oneOf, optional, record, str, union, Validated } from "../generic/validation";

export const status = oneOf(['active', 'inactive', 'done']);

const updateFields = {
  created: {
    description: str,
  },

  update: {
    description: optional(str),
    status: optional(status),
  },

  comment: {
    comment: str
  }
};

const updateModel = record({
  timestamp: num,
  content: union(updateFields)
});

export const projectModel = record({
  description: str,
  status,
  lastUpdated: num,
  updates: array(updateModel),
  associatedFile: optional(str),
});

export type Status = Validated<typeof status>;

export type Update = Validated<typeof updateModel>;

export type Project = Validated<typeof projectModel>;

export function createProject(description: string): Project {
  const timestamp = Date.now();

  return {
    description,
    lastUpdated: timestamp,
    status: 'active',
    updates: [{
      timestamp,
      content: {
        kind: 'created',
        description,
      }
    }],
    associatedFile: undefined
  }
}
