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

export function oneOf<S extends number|string>(options: readonly S[]): Validator<(typeof options)[number]> {
  return {
    validate(input: any): input is (typeof options)[number] {
      return (options.indexOf(input) !== -1);
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

export function record<T extends Record<string, Validator<any>>>(inner: T): Validator<ValidatedFields<T>> {
  return {
    validate(input: any): input is ValidatedFields<T> {
      if (input === null || typeof input !== "object") {
        return false;
      }

      for (const [key, value] of Object.entries(inner)) {
        if (!value.validate(input[key])) {
          return false;
        }
      }

      return true;
    }
  }
}

export function array<T>(inner: Validator<T>): Validator<T[]> {
  return {
    validate(input: any): input is T[] {
      if (!Array.isArray(input)) {
        return false;
      }

      for (const v of input) {
        if (!inner.validate(v)) {
          return false;
        }
      }

      return true;
    }
  }
}

export function union<T extends Record<string, Record<string, Validator<any>>>>(inner: T): Validator<Union<Kinds<ValidatedKinds<T>>>> {
  return {
    validate(input: any): input is Union<Kinds<ValidatedKinds<T>>> {
      if (input === null || typeof input !== "object") {
        return false;
      }

      const kind = input["kind"];
      if (typeof kind !== "string") {
        return false;
      }

      const validator = inner[kind];
      if (validator === undefined) {
        return false;
      }

      for (const [key, value] of Object.entries(validator)) {
        if (!value.validate(input[key])) {
          return false;
        }
      }

      return true;
    }
  }
}

class LazyValidator<T> implements Validator<T> {
  thunk: () => Validator<T>;
  forced?: Validator<T>;

  constructor(thunk: () => Validator<T>) {
    this.thunk = thunk;
  }

  validate(input: any): input is T {
    if (this.forced === undefined) {
      this.forced = this.thunk();
    }

    return this.forced.validate(input);
  }
}

export function lazy<T>(thunk: () => Validator<T>): Validator<T> {
  return new LazyValidator(thunk);
}
