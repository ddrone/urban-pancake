import m from 'mithril';

export function tableRow(cells: string[], width: number): m.Child {
  if (cells.length === 0) {
    return m('tr', m('td', {
      colspan: width
    }, '...empty row'));
  }

  const rendered: m.Child[] = [];
  for (let i = 0; i < cells.length; i++) {
    if (i + 1 === cells.length) {
      rendered.push(m('td', {
        colspan: width - cells.length + 1
      }, cells[i]));
    }
    else {
      rendered.push(m('td', cells[i]));
    }
  }

  return m('tr', rendered);
}
