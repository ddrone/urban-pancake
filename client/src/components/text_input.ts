import m from 'mithril';

export interface TextInputAttrs {
  buttonText: string;
  onEntry: (value: string) => void;
}

export class TextInput implements m.ClassComponent<TextInputAttrs> {
  textInput?: HTMLInputElement;

  sendEntry(attrs: TextInputAttrs) {
    const entry = this.textInput?.value ?? '';
    attrs.onEntry(entry);
    if (this.textInput !== undefined) {
      this.textInput.value = '';
    }
  }

  view(vnode: m.Vnode<TextInputAttrs>): m.Child {
    return m('.text-input',
      m('input', {
        oncreate: (element) => {
          this.textInput = element.dom as HTMLInputElement;
        },
        onkeyup: (event: KeyboardEvent) => {
          if (event.key === "Enter") {
            this.sendEntry(vnode.attrs);
          }
        }
      }),
      m('button', {
        onclick: () => {
          this.sendEntry(vnode.attrs);
        }
      }, vnode.attrs.buttonText)
    )
  }
}
