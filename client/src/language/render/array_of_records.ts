import { Type, isPrimitiveType } from '../types';
import { Json, JsonArray, JsonObject } from '../../utils/json';
import { onlyMapEntry } from '../../utils/map';
import { empty2D, maxArray, sumArray } from '../../utils/arrays';
import m from 'mithril';

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

export function concatPrefix(s: string, prefix?: string) {
  if (prefix === undefined) {
    return s;
  }
  else if (prefix.endsWith(']') || s.startsWith('[')) {
    return `${prefix}${s}`;
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

export function buildHeaderTrees(items: Map<string, Type>, prefix?: string): HeaderTree[] {
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

export function printRecordEntry(fields: Map<string, Type>, value: JsonObject): m.Child[] {
  const cells: string[][] = [];
  printRecordEntryToCells(cells, fields, value);

  const rowCount = maxArray(0, cells.map(column => column.length));
  const rowOrderCells = empty2D<m.Child>(rowCount);

  for (const column of cells) {
    const lastDiff = rowCount - column.length;

    for (let i = 0; i < column.length; i++) {
      const last = i + 1 === column.length;
      rowOrderCells[i].push(m('td', {
        rowspan: 1 + (last ? lastDiff : 0)
      }, column[i]));
    }
  }

  return rowOrderCells.map(cells => m('tr', cells));
}

function printRecordEntryToCells(cells: string[][], fields: Map<string, Type>, value: JsonObject) {
  for (const [name, fieldType] of fields.entries()) {
    const fieldValue = value[name];

    if (fieldType.kind === 'record') {
      printRecordEntryToCells(cells, fieldType.items, fieldValue as JsonObject);
    }
    else {
      cells.push(printCellValue(fieldType, fieldValue));
    }
  }
}

export function printCellValue(type: Type, value: Json): string[] {
  if (type.kind === 'array' && isPrimitiveType(type.item)) {
    const array = value as JsonArray;
    if (array.length === 0) {
      return ['...empty array'];
    }
    return array.map((x) => printCompactCellValue(type.item, x));
  }
  return [printCompactCellValue(type, value)];
}

// TODO: make the compound values clickable buttons instead
export function printCompactCellValue(type: Type, value: Json): string {
  if (type.kind === 'array') {
    return '[array]';
  }
  else if (type.kind === 'record') {
    return '[record]';
  }
  else {
    return `${value}`;
  }
}