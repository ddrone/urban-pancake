import { array, bool, num, optional, record, str, union, Validated } from "../generic/validation";

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

const projectModel = record({
  description: str,
  isActive: bool,
  lastUpdated: num,
  updates: array(record({
    timestamp: num,
    content: union(updateModel)
  }))
});

export type Project = Validated<typeof projectModel>;

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
