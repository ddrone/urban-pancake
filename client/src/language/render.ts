import m from 'mithril';
import { Type } from './types';
import { Json, JsonObject } from '../utils/json';
import { todo } from '../utils/todo';
import { buildHeaderTrees, printRecordEntry, renderHeaderTrees } from './render/array_of_records';
import { renderRecord } from './render/record';
import { toTypedView } from './destruct';


export function printValue(type: Type, value: Json): m.Child {
  const view = toTypedView(type, value);
  if (view.kind === 'record') {
    return m('table.printed-value', renderRecord(view.type.items, view.value));
  }
  else if (view.kind === 'array') {
    const arr = view.value;
    if (arr.length === 0) {
      return m('em', 'Empty array');
    }

    const elementType = view.type.item;

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

    return todo('Implement the basic arrays');
  }
  else {
    return `${view.value}`;
  }
}
