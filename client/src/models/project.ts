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
  },

  bumpdown: {}
};

const allUpdates = union(updateFields);

const updateModel = record({
  timestamp: num,
  content: allUpdates
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

export type UpdateContent = Validated<typeof allUpdates>;

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
