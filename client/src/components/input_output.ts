import m from 'mithril';
import { Textarea } from './textarea';

export interface IOAttrs {
  transform: (input: string) => string;
}

export class IOBox implements m.ClassComponent<IOAttrs> {
  output = '';

  view(vnode: m.Vnode<IOAttrs>): m.Child {
    return m('div',
      m(Textarea, {
        onCtrlEnter: (value) => {
          this.output = vnode.attrs.transform(value);
        }
      }),
      m('pre', this.output)
    );
  }
}
