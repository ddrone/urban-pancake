import m from 'mithril';
import { Console } from './language/graphic_console';
import { Parser } from './language/parser/descent';

export class Playground implements m.ClassComponent {
  oncreate() {
    const parser = new Parser('2 + 2 * 2');
    console.log(parser.expr1());
  }

  view(): m.Child {
    return m(Console);
  }
}
