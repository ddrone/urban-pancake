import m from 'mithril';
import { buildTree } from './algorithms/naive_bst';

export class Playground implements m.ClassComponent {
  view(): m.Child {
    const tree = buildTree(5, 2, 4, 3, 1);

    return JSON.stringify(tree);
  }
}
