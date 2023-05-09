import m from 'mithril';

export class Repl implements m.ClassComponent {
  inputs: string[] = [];
  textarea: HTMLTextAreaElement = undefined as any;

  handleEntry() {
    this.inputs.push(this.textarea.value);
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
      this.inputs.slice().reverse().map(input => m('.card', input))
    )
  }
}
