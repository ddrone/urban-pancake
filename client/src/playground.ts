import m from 'mithril';
import { Console, debug } from './language/graphic_console';
import { regexParser } from './language/parser/parser';

export class Playground implements m.ClassComponent {
  oncreate() {
    const parser = regexParser(/[0-9]+/);
    debug(parser.start('102938 test') as any);
  }

  view(): m.Child {
    return m(Console);
  }
}
