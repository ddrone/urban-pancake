export function groupBy<T>(arr: T[], key: (t: T) => number): Map<number, T[]> {
  const result = new Map<number, T[]>();

  for (const elem of arr) {
    const k = key(elem);
    if (!result.has(k)) {
      result.set(k, []);
    }
    result.get(k)!.push(elem);
  }

  return result;
}
