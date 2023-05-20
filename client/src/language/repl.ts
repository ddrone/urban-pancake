import m from 'mithril';
import example from './data/records.json';
import { Chunk, ChunkView } from './chunk';
import { Textarea } from '../components/textarea';
import { PushdownSignal } from '../components/pushdown_signal';

export class Repl implements m.ClassComponent {
  inputs: Chunk[] = [];
  clearArea = new PushdownSignal();

  oncreate() {
    this.inputs.push(new Chunk(JSON.stringify(example)));
    m.redraw();
  }

  view(): m.Child {
    return m('div',
      m('.entry',
        m(Textarea, {
          onCtrlEnter: (value) => {
            this.inputs.push(new Chunk(value));
            this.clearArea.push();
          },
          clear: this.clearArea
        })),
      this.inputs.slice().reverse().map(chunk => m(ChunkView, { chunk }))
    )
  }
}
