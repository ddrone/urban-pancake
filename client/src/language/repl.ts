import m from 'mithril';

export class Repl implements m.ClassComponent {
  inputs: string[] = [];
  textarea: HTMLTextAreaElement = undefined as any;

  view(): m.Child {
    return m('div',
      m('.entry',
        m('textarea', {
          oncreate: (node: m.VnodeDOM) => {
            this.textarea = node.dom as HTMLTextAreaElement;
          }
        }),
        m('br'),
        m('button', 
          {
            onclick: () => {
              this.inputs.push(this.textarea.value);
            }
          },
          'Enter')),
      this.inputs.slice().reverse().map(input => m('.card', input))
    )
  }
}
