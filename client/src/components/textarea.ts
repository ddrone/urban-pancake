import m from 'mithril';
import { PushdownSignal } from './pushdown_signal';

export interface TextareaAttrs {
  onCtrlEnter: (input: string) => void;
  clear?: PushdownSignal;
}

export class Textarea implements m.ClassComponent<TextareaAttrs> {
  dom: HTMLTextAreaElement = undefined as any;

  view(vnode: m.Vnode<TextareaAttrs>): m.Child {
    if (vnode.attrs.clear !== undefined && vnode.attrs.clear.get()) {
      this.dom.value = '';
    }

    return m('textarea', {
      oncreate: (e: m.VnodeDOM) => {
        this.dom = e.dom as HTMLTextAreaElement;
      },
      onkeyup: (e: KeyboardEvent) => {
        if (e.key === 'Enter' && e.ctrlKey) {
          vnode.attrs.onCtrlEnter(this.dom.value);
        }
      }
    });
  }
}

