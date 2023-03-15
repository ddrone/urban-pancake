import { array, bool, num, optional, record, str, union, Validated } from "../generic/validation";

const updateFields = {
  created: {
    description: str,
    isActive: bool
  },

  update: {
    description: optional(str),
    isActive: optional(bool)
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
        isActive: true
      }
    }]
  }
}
