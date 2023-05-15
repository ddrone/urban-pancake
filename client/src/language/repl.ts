import m from 'mithril';
import { Json, readJson } from '../utils/json';
import { Type } from './types';
import { inferType } from './typecheck';
import { printValue } from './render';
import example from './data/records.json';

class Chunk {
  rawInput: string;
  input?: Json;
  type?: Type;

  constructor(rawInput: string) {
    this.rawInput = rawInput;
    this.input = readJson(rawInput);
    if (this.input !== undefined) {
      this.type = inferType(this.input);
    }
  }
}

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

  renderInput(input: Chunk): m.Child {
    if (input.input === undefined) {
      return m('.card.red', input.rawInput);
    }

    return m('.card',
      input.rawInput,
      m('br'),
      input.type === undefined &&
        'Type error!',
      input.type !== undefined &&
        printValue(input.type, input.input),
    );
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
      this.inputs.slice().reverse().map(input => this.renderInput(input))
    )
  }
}
