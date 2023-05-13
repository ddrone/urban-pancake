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

export function maxArray(def: number, xs: number[]): number {
  if (xs.length === 0) {
    return def;
  }
  return Math.max(...xs);
}

export function defined<T>(...items: Array<T|undefined>): T[] {
  return items.filter(x => x !== undefined) as T[];
}

export function empty2D<T>(rows: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < rows; i++) {
    result.push([]);
  }
  return result;
}
