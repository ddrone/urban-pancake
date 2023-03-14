import m from 'mithril';

export interface ButtonAttrs {
  onclick: () => void;
}

export class Button implements m.ClassComponent<ButtonAttrs> {
  view(vnode: m.Vnode<ButtonAttrs>): m.Child {
    return m('button', {
      onclick: vnode.attrs.onclick
    }, vnode.children);
  }
}
