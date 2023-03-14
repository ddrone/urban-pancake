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
    "contents": str
  }
};

const updateValidator = union(updateModel);

export type Update = {
  content: Validated<typeof updateValidator>;
  timestamp: number;
}

// TODO: extract these "tests" into actual tests.
const test1: Update = {
  timestamp: 1,
  content: {
    kind: "created",
    description: "Test",
    isActive: true
  }
};

const test2: Update = {
  timestamp: 2,
  content: {
    kind: "update",
    // TODO: figure out how to get rid of extra "undefined" fields in the literals declaration
    description: undefined,
    isActive: undefined
  }
};
