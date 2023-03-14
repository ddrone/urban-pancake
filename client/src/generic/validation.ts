import { Kinds, Union } from "../utils/union";

export interface Validator<T> {
  validate(input: any): input is T
}

export const str: Validator<string> = {
  validate(input: any): input is string {
    return typeof input === "string";
  }
}

export const num: Validator<number> = {
  validate(input: any): input is number {
    return typeof input === "number";
  }
}

export const bool: Validator<boolean> = {
  validate(input: any): input is boolean {
    return typeof input === "boolean";
  }
}

export function optional<T>(inner: Validator<T>): Validator<T | undefined> {
  return {
    validate(input: any): input is T | undefined {
      if (inner.validate(input)) {
        return true;
      }
      return input === undefined;
    }
  }
}

export type Validated<V> = V extends Validator<infer T> ? T : never;

type ValidatedFields<R> = {
  [k in keyof R]: Validated<R[k]>
};

type ValidatedKinds<R> = {
  [k in keyof R]: ValidatedFields<R[k]>
};

export function union<T extends Record<string, Record<string, Validator<any>>>>(inner: T): Validator<Union<Kinds<ValidatedKinds<T>>>> {
  throw new Error("not implemented yet");
}
