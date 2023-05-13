import m from 'mithril';
import { buildAugmentedTree, buildTree, renderAugmentedTree } from './algorithms/naive_bst';

export class Playground implements m.ClassComponent {
  view(): m.Child {
    const tree = buildTree(5, 2, 4, 3, 1);

    const augTree = buildAugmentedTree(tree.root!);
    return renderAugmentedTree(augTree);
  }
}
