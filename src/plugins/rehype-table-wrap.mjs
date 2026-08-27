import { visit, SKIP } from 'unist-util-visit';

// Wrap every table in div.table-wrap so a wide table scrolls inside
// its own container instead of the page (see .prose .table-wrap).
export function rehypeTableWrap() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'table' || !parent || index === undefined) return;
      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-wrap'] },
        children: [node],
      };
      return SKIP;
    });
  };
}
