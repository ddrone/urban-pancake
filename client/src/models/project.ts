import { Kinds, Union } from "../utils/union";

export interface Project {
  description: string;
  isActive: boolean;
  lastUpdated: number;
  updates: Update[];
}

type UpdateOptions = Kinds<{
  "created": {
    description: string;
    isActive: boolean;
  },

  "update": {
    description?: string;
    isActive?: boolean;
  },

  // Free-form project update, made in order to track progress.
  "comment": {
    contents: string;
  }
}>;

export type Update = {
  content: Union<UpdateOptions>;
  timestamp: number;
}
