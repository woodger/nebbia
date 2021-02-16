import assert from 'assert';
import nebbia from '../src';

describe('class nebbia.Node', () => {
  it('The "class Node" must be of function type', () => {
    assert(typeof nebbia.Node === 'function');
  });

  it('constructor: new Node()', () => {
    const node = new nebbia.Node();

    assert(node.type === null);
    assert(node.name === null);
    assert(node.parent === null);
    assert(node.value === '');
    assert(node.childs instanceof Array);
  });
});
