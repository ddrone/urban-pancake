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
