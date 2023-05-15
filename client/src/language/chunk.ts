import { Json, readJson } from '../utils/json';
import { Type } from './types';
import { inferType } from './typecheck';
import m from 'mithril';
import { printValue } from './render';

export class Chunk {
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

interface ChunkViewAttrs {
  chunk: Chunk;
}

export class ChunkView implements m.ClassComponent<ChunkViewAttrs> {
  view(vnode: m.Vnode<ChunkViewAttrs>): m.Child {
    const input = vnode.attrs.chunk;
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
}