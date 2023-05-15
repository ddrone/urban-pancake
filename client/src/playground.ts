import m from 'mithril';
import { Console, debug } from './language/graphic_console';

export class Playground implements m.ClassComponent {
  oncreate() {
    debug({ name: 'Andrew', age: 29 });
    debug([[0, 1], [2, 3]]);
    debug([0, "test"]);
  }

  view(): m.Child {
    return m(Console);
  }
}
