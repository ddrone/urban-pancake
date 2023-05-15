import m from 'mithril';
import { Console, debug } from './language/graphic_console';

export class Playground implements m.ClassComponent {
  oncreate() {
    debug({ key: 'A key', value: 1337 });
    debug([
      {
        name: {
          first: 'John',
          second: 'Doe'
        },
        age: 100
      },
      {
        name: {
          first: 'Other',
          second: 'Name'
        },
        age: 150
      }
    ])
    debug([[0, 1], [2, 3]]);
    debug([0, "test"]);
  }

  view(): m.Child {
    return m(Console);
  }
}
