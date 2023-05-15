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
    const chunk = vnode.attrs.chunk;
    if (chunk.input === undefined) {
      return m('.card.red', chunk.rawInput);
    }

    return m('.card',
      chunk.type === undefined && [
        chunk.rawInput,
        m('br'),
        'Type error!'
      ],
      chunk.type !== undefined &&
        printValue(chunk.type, chunk.input),
    );
  }
}