import m from 'mithril';
import { Console } from './language/graphic_console';
import { Parser } from './language/parser/descent';
import { IOBox } from './components/input_output';

export class Playground implements m.ClassComponent {
  oncreate() {
  }

  view(): m.Child {
    return m('div',
      m(IOBox, {
        transform: (input) => {
          const parser = new Parser(input);
          const result = parser.program();
          return JSON.stringify(result, null, 4);
        }
      }),
      m(Console)
    );
  }
}
