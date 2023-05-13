import { defined, maxArray, sumArray } from "../utils/arrays";

export interface Node {
  key: number;
  left?: Node;
  right?: Node;
}

class NaiveTree {
  root?: Node;

  insert(key: number) {
    if (this.root === undefined) {
      this.root = {
        key
      }
    }
    else {
      this.insertToNode(this.root, key);
    }
  }

  private insertToNode(node: Node, key: number) {
    while (key !== node.key) {
      if (key < node.key) {
        if (node.left === undefined) {
          node.left = {
            key
          }
          break;
        }
        else {
          node = node.left;
        }
      }
      else {
        if (node.right === undefined) {
          node.right = {
            key
          }
          break;
        }
        else {
          node = node.right;
        }
      }
    }
  }
}

export function buildTree(...items: number[]): NaiveTree {
  const result = new NaiveTree();
  for (const x of items) {
    result.insert(x);
  }
  return result;
}

// Tree can be rendered in two steps:
// 1. First, we compute total width and height in terms of cells via bottom-up traversal
// 2. Second, we push this information in order to use the rectangular space
// 3. Step about fitting all of that into `tr` and `td` cells are still unclear

// Actually, steps 1 and 2 can be combined into one traversal, because pushing of the
// information about own width and height can be done locally.

interface AugmentedTree {
  key: number;

  totalHeight: number;
  ownHeight: number;
  width: number;

  children: AugmentedTree[];
}

function nodeChildren(node: Node): Node[] {
  return defined(node.left, node.right);
}

export function buildAugmentedTree(tree: Node): AugmentedTree {
  const children = nodeChildren(tree).map(buildAugmentedTree);
  const childrenHeight = maxArray(0, children.map(child => child.totalHeight));
  const width = Math.max(1, sumArray(children.map(child => child.width)));

  for (const child of children) {
    const diff = childrenHeight - child.totalHeight;
    child.totalHeight += diff;
    child.ownHeight += diff;
  }

  return {
    key: tree.key,
    totalHeight: childrenHeight + 1,
    ownHeight: 1,
    width,
    children
  }
}
