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
