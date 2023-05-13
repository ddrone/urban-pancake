import m from 'mithril';
import { Type } from './types';
import { Json, JsonArray } from '../utils/json';
import { todo } from '../utils/todo';
import { onlyMapEntry } from '../utils/map';
import { sumArray } from '../utils/arrays';

interface HeaderTree {
  name: string;
  depth: number;
  width: number;
  children?: HeaderTree[];
}

function headerTreeLeaf(name: string): HeaderTree {
  return {
    name,
    depth: 1,
    width: 1,
  }
}

function concatPrefix(s: string, prefix?: string) {
  if (prefix === undefined) {
    return s;
  }
  return `${prefix}.${s}`;
}

function innermost(item: Type, name: string): [Type, string] {
  if (item.kind === 'record' && item.items.size === 1) {
    const [nextName, next] = onlyMapEntry(item.items);
    return innermost(next, concatPrefix(nextName, name));
  }

  return [item, name];
}

function buildHeaderTrees(items: Map<string, Type>, prefix?: string): HeaderTree[] {
  const result: HeaderTree[] = [];
  for (const [key, field] of items.entries()) {
    const [value, treeItemName] = innermost(field, concatPrefix(key, prefix));
    if (value.kind === 'record') {
      const children = buildHeaderTrees(value.items);
      if (children.length === 0) {
        result.push(headerTreeLeaf(treeItemName));
      }
      else {
        const depth = Math.max(...children.map(child => child.depth)) + 1;
        const width = sumArray(children.map(child => child.width));
        result.push({
          name: treeItemName,
          depth,
          children,
          width
        })
      }
    }
    else {
      result.push(headerTreeLeaf(treeItemName));
    }
  }

  return result;
}

interface Cell {
  content: string;
  colspan: number;
  rowspan: number;
}

function buildColumn(tree: HeaderTree, height: number): Cell[][] {
  if (tree.depth > height) {
    throw new Error('should not happen');
  }

  const firstColspan = height - tree.depth + 1;

  const result: Cell[][] = [
    [{
      content: tree.name,
      colspan: firstColspan,
      rowspan: tree.width
    }]
  ];

  let children = tree.children;
  if (children === undefined) {
    return result;
  }

  while (true) {
  }
}

export function printValue(type: Type, value: Json): m.Child {
  if (type.kind === 'record') {
    todo('Implement record printing')
  }
  if (type.kind === 'array') {
    const arr = value as JsonArray;

    if (arr.length === 0) {
      return m('em', 'Empty array');
    }

    const elementType = type.item;

    if (elementType.kind === 'array') {
      todo('Implement two-dimensional array printing');
    }

    if (elementType.kind === 'record') {
      // First, need to generate the header.
      todo('That')

      // Then, need to print every single entry of the record as a row.
      todo('That');
    }
  }
  else {
    // Primitive types
    return `${value}`;
  }
}