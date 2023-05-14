import m from 'mithril';
import { Type } from './types';
import { Json, JsonArray, JsonObject } from '../utils/json';
import { todo } from '../utils/todo';
import { buildHeaderTrees, printRecordEntry, renderHeaderTrees } from './render/array_of_records';
import { renderRecord } from './render/record';


export function printValue(type: Type, value: Json): m.Child {
  if (type.kind === 'record') {
    return renderRecord(type.items, value as JsonObject);
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
        renderHeaderTrees(headerTrees),
        arr.map(value => printRecordEntry(elementType.items, value as JsonObject))
      );
    }
  }
  else {
    // Primitive types
    return `${value}`;
  }
}
