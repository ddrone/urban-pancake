import m from 'mithril';
import { Type } from './types';
import { Json, JsonArray } from '../utils/json';
import { todo } from '../utils/todo';
import { onlyMapEntry } from '../utils/map';
import { empty2D, sumArray } from '../utils/arrays';

interface HeaderTree {
  name: string;
  ownHeight: number;
  height: number;
  width: number;
  children: HeaderTree[];
}

function headerTreeLeaf(name: string): HeaderTree {
  return {
    name,
    ownHeight: 1,
    height: 1,
    width: 1,
    children: []
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

function normalizeTrees(trees: HeaderTree[]): number {
  const childrenHeight = Math.max(...trees.map(child => child.height));
  for (const tree of trees) {
    const diff = childrenHeight - tree.height;
    tree.height += diff;
    tree.ownHeight += diff;
  }

  return childrenHeight;
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
        const childrenHeight = normalizeTrees(children);
        const width = sumArray(children.map(child => child.width));

        result.push({
          name: treeItemName,
          height: childrenHeight + 1,
          ownHeight: 1,
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

export function renderHeaderTrees(trees: HeaderTree[]): m.Child[] {
  const height = normalizeTrees(trees);
  const rows = empty2D<m.Child>(height);

  for (const tree of trees) {
    renderHeaderTreeTo(rows, tree, 0);
  }

  return rows.map(row => m('tr', row));
}

function renderHeaderTreeTo(rows: m.Child[][], tree: HeaderTree, row: number) {
  rows[row].push(m('td', {
    rowspan: tree.ownHeight,
    colspan: tree.width
  }, tree.name));

  for (const child of tree.children) {
    renderHeaderTreeTo(rows, child, row + tree.ownHeight);
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
      const headerTrees = buildHeaderTrees(elementType.items);
      return m('table.printed-value',
        renderHeaderTrees(headerTrees)
      );

      // TODO: Then, need to print every single entry of the record as a row.
    }
  }
  else {
    // Primitive types
    return `${value}`;
  }
}