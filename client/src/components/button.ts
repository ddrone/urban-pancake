import m from 'mithril';

export interface ButtonAttrs {
  onclick: () => void;
  disabled?: boolean;
}

export class Button implements m.ClassComponent<ButtonAttrs> {
  view(vnode: m.Vnode<ButtonAttrs>): m.Child {
    return m('button', vnode.attrs, vnode.children);
  }
}
