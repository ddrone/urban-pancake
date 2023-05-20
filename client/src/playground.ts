import m from 'mithril';
import { Console } from './language/graphic_console';
import { Parser } from './language/parser/descent';
import { Textarea } from './components/textarea';
import { FlatCompiler } from './language/compiler/compiler';
import { Vis, VisAttrs } from './language/compiler/visualisation';

// Currently only here for copy-paste purposes
const program = `
x = 10 + 2 * (3 + 4)
y = x + x * x
print(y)
`;

export class Playground implements m.ClassComponent {
  data?: VisAttrs;

  oncreate() {
  }

  view(): m.Child {
    return m('div',
      m(Textarea, {
        onCtrlEnter: (value) => {
          const program = new Parser(value).program();
          const compiler = new FlatCompiler();
          for (const stmt of program.stmts) {
            compiler.compileStmt(stmt);
          }

          this.data = {
            source: value,
            compiled: compiler.sink
          }
        }
      }),
      this.data !== undefined && m(Vis, this.data),
      m(Console)
    );
  }
}
