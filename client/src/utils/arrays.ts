export function onlyArrayItem<T>(items: T[]): T {
  if (items.length !== 1) {
    throw new Error('only one item expected');
  }
  return items[0];
}

// Stupid ass language not even having builtin conveniences for basic operations
export function sumArray(xs: number[]): number {
  let result = 0;
  for (const x of xs) {
    result += x;
  }
  return result;
}
