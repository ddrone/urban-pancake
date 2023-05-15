import m from 'mithril';
import { Json } from '../utils/json';
import { Chunk, ChunkView } from './chunk';

export class Console implements m.ClassComponent {
  view(): m.Child {
    return m('div', globalStore.map(chunk => m(ChunkView, { chunk })));
  }
}

const globalStore: Chunk[] = [];

export function debug(json: Json) {
  // TODO: probably might make sense to get rid of round-trip of converting to string and back
  globalStore.push(new Chunk(JSON.stringify(json)));
  m.redraw();
}
