import { bool, optional, str, union, Validated } from "../generic/validation";

export interface Project {
  description: string;
  isActive: boolean;
  lastUpdated: number;
  updates: Update[];
}

const updateModel = {
  "created": {
    "description": str,
    "isActive": bool
  },

  "update": {
    "description": optional(str),
    "isActive": optional(bool)
  },

  "comment": {
    "comment": str
  }
};

const updateValidator = union(updateModel);

export type Update = {
  content: Validated<typeof updateValidator>;
  timestamp: number;
}

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
