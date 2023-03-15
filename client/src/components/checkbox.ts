import m from 'mithril';
import { Box } from '../utils/box';

interface CheckboxAttrs {
  checked: Box<boolean>;
}

export class Checkbox implements m.ClassComponent<CheckboxAttrs> {
  label: string;

  constructor() {
    this.label = labelGenerator.create();
  }

  view(vnode: m.Vnode<CheckboxAttrs>): m.Child {
    return m('.checkbox',
      m('input', {
        type: 'checkbox',
        checked: vnode.attrs.checked.value,
        id: this.label,
        onclick: (e: Event) => {
          const target = e.target as HTMLInputElement;
          vnode.attrs.checked.value = target.checked;
        }
      }),
      m('label', {
        'for': this.label
      }, vnode.children)
    )
  }
}

const labelGenerator = {
  _nextId: 0,
  create() {
    const id = this._nextId++;
    return `checkbox${id}`;
  }
};
