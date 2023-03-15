export type Ordering<T> = (x: T, y: T) => number;

export function comparing<T>(fn: (x: T) => number): Ordering<T> {
  return (x, y) => fn(x) - fn(y);
}

export function comparingByString<T>(fn: (x: T) => string): Ordering<T> {
  return (x, y) => fn(x).localeCompare(fn(y));
}
