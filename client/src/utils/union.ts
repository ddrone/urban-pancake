export type Kinds<R> = {
  [k in keyof R]: R[k] & { kind: k };
};

export type Union<R> = R[keyof R];
