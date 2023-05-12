import { onlyArrayItem } from "./arrays"

export function onlyMapEntry<K, V>(map: Map<K, V>): [K, V] {
  if (map.size !== 1) {
    throw new Error('onlyMapEntry expects map of size 1');
  }

  return onlyArrayItem([...map.entries()]);
}

export function onlyMapValue<K, V>(map: Map<K, V>): V {
  if (map.size !== 1) {
    throw new Error('onlyMapValue expects map of size 1');
  }

  return onlyArrayItem([...map.values()]);
}
