import m from 'mithril';
import { Type, isPrimitiveType } from './types';
import { Json, JsonObject } from '../utils/json';
import { buildHeaderTrees, printCompactCellValue, printRecordEntry, renderHeaderTrees } from './render/array_of_records';
import { renderRecord } from './render/record';
import { toTypedView } from './destruct';
import { downcast } from '../utils/types';
import { tableRow } from '../utils/tables';

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

    if (elementType.kind === 'array' && isPrimitiveType(elementType.item) && view.value.length > 0 && downcast<Json[][]>(arr)) {
      const cells: string[][] = [];
      for (const row of arr) {
        cells.push(row.map(elem => printCompactCellValue(elementType.item, elem)));
      }

      const width = Math.max(1, ...cells.map(row => row.length));
      return m('table.printed-value',
        cells.map(row => tableRow(row, width))
      );
    }

    if (elementType.kind === 'record') {
      const headerTrees = buildHeaderTrees(elementType.items);
      return m('table.printed-value',
        renderHeaderTrees(headerTrees),
        arr.map(value => printRecordEntry(elementType.items, value as JsonObject))
      );
    }

    return m('table.printed-value',
      arr.map(value => m('tr', m('td', printCompactCellValue(elementType, value))))
    );
  }
  else {
    return `${view.value}`;
  }
}
