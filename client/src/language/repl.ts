import m from 'mithril';
import example from './data/records.json';
import { Chunk, ChunkView } from './chunk';

export class Repl implements m.ClassComponent {
  inputs: Chunk[] = [];
  textarea: HTMLTextAreaElement = undefined as any;

  oncreate() {
    this.inputs.push(new Chunk(JSON.stringify(example)));
    m.redraw();
  }

  handleEntry() {
    this.inputs.push(new Chunk(this.textarea.value));
    this.textarea.value = '';
  }


  view(): m.Child {
    return m('div',
      m('.entry',
        m('textarea', {
          oncreate: (node: m.VnodeDOM) => {
            this.textarea = node.dom as HTMLTextAreaElement;
          },
          onkeyup: (e: KeyboardEvent) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              this.handleEntry();
            }
          }
        }),
        m('br'),
        m('button',
          {
            onclick: () => {
              this.handleEntry();
            },
            title: 'Ctrl+Enter'
          },
          'Enter')),
      this.inputs.slice().reverse().map(chunk => m(ChunkView, { chunk }))
    )
  }
}
