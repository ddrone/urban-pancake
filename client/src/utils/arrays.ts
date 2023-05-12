export function onlyArrayItem<T>(items: T[]): T {
  if (items.length !== 1) {
    throw new Error('only one item expected');
  }
  return items[0];
}
