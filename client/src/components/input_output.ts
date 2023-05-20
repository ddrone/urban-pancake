import m from 'mithril';

export interface IOAttrs {
  transform: (input: string) => string;
}

export class IOBox implements m.ClassComponent<IOAttrs> {
  view(vnode: m.Vnode<IOAttrs>): m.Child {
    return 'TODO';
  }
}
