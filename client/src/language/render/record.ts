import m from 'mithril';
import { Type } from '../types';
import { Json, JsonArray, JsonObject } from '../../utils/json';
import { concatPrefix, printCellValue } from './array_of_records';
import { onlyMapEntry } from '../../utils/map';
import { downcast } from '../../utils/types';

function innermost(type: Type, name: string, value: Json): [Type, string, Json] {
  if (type.kind === 'record' && type.items.size === 1) {
    const [nextName, next] = onlyMapEntry(type.items);
    return innermost(next, concatPrefix(nextName, name), (value as JsonObject)[nextName]);
  }
  if (type.kind === 'array' && downcast<JsonArray>(value) && value.length === 1) {
    return innermost(type.item, concatPrefix('[0]', name), value[0]);
  }

  return [type, name, value];
}

export function renderRecord(items: Map<string, Type>, value: JsonObject): m.Child[] {
  const renderedRows: m.Child[] = [];

  renderRecordToRows(renderedRows, 0, items, value);

  return renderedRows;
}

function renderRecordItemToRows(rows: m.Child[], indent: number, fieldName: string, fieldType: Type, value: Json) {
  // TODO: This kind of pattern of value[fieldName] should be abstracted away with runtime type checking
  const [childType, key, child] = innermost(fieldType, fieldName, value);
  const style = {
    'padding-left': `${0.5 * (indent + 1)}em`
  };

  if (childType.kind === 'record') {
    rows.push(m('tr', m('td', {
      colspan: 2,
      style
    }, key)));

    renderRecordToRows(rows, indent + 1, childType.items, child as JsonObject);
    return;
  }

  special: if (childType.kind === 'array' && childType.item.kind === 'record' && downcast<JsonArray>(child)) {
    if (child.length === 0) {
      break special;
    }

    rows.push(m('tr', m('td', {
      colspan: 2,
      style
    }, key)));

    for (let i = 0; i < child.length; i++) {
      renderRecordItemToRows(rows, indent + 1, `[${i}]`, childType.item, child[i]);
    }
  }

  const cells = printCellValue(childType, child);

  rows.push(m('tr',
    m('td', {
      rowspan: cells.length,
      style
    }, key),
    m('td', cells[0])
  ))
  for (let i = 1; i < cells.length; i++) {
    rows.push(m('tr', m('td', cells[i])));
  }
}

function renderRecordToRows(rows: m.Child[], indent: number, items: Map<string, Type>, value: JsonObject) {
  for (const [fieldName, fieldType] of items.entries()) {
    renderRecordItemToRows(rows, indent, fieldName, fieldType, value[fieldName]);
  }
}
