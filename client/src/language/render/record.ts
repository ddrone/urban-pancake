import m from 'mithril';
import { Type } from '../types';
import { Json, JsonObject } from '../../utils/json';
import { concatPrefix, printCellValue } from './array_of_records';
import { onlyMapEntry } from '../../utils/map';

function innermost(type: Type, name: string, value: Json): [Type, string, Json] {
  if (type.kind === 'record' && type.items.size === 1) {
    const [nextName, next] = onlyMapEntry(type.items);
    return innermost(next, concatPrefix(nextName, name), (value as JsonObject)[nextName]);
  }

  return [type, name, value];
}

export function renderRecord(items: Map<string, Type>, value: JsonObject): m.Child[] {
  const renderedRows: m.Child[] = [];

  renderRecordToRows(renderedRows, 0, items, value);

  return renderedRows;
}

function renderRecordToRows(rows: m.Child[], indent: number, items: Map<string, Type>, value: JsonObject) {
  for (const [fieldName, fieldType] of items.entries()) {
    // TODO: This kind of pattern of value[fieldName] should be abstracted away with runtime type checking
    const [childType, key, child] = innermost(fieldType, fieldName, value[fieldName]);
    const style = {
      'padding-left': `${0.5 * (indent + 1)}em`
    };

    if (childType.kind === 'record') {
      rows.push(m('tr', m('td', {
        colspan: 2,
        style
      }, key)));

      renderRecordToRows(rows, indent + 1, childType.items, child as JsonObject);
      continue;
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
}
