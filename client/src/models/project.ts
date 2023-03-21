import { array, bool, num, oneOf, optional, record, str, union, Validated } from "../generic/validation";

export const status = oneOf(['active', 'inactive', 'done']);

const updateFields = {
  created: {
    description: str,
    status: optional(status),
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
  isActive: bool,
  lastUpdated: num,
  updates: array(updateModel)
});

export type Update = Validated<typeof updateModel>;

export type Project = Validated<typeof projectModel>;

export function createProject(description: string): Project {
  const timestamp = Date.now();

  return {
    description,
    isActive: true,
    lastUpdated: timestamp,
    updates: [{
      timestamp,
      content: {
        kind: 'created',
        description,
        status: 'active',
      }
    }]
  }
}
