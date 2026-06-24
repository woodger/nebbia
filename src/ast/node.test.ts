import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import Node from './node';

describe('class Node', () => {
  test('exports constructor function', () => {
    assert.strictEqual(typeof Node, 'function');
  });

  test('appends child nodes to children collection', () => {
    class TestNode extends Node {}

    const parent = new TestNode();
    const child = new TestNode();

    parent.append(child);

    assert.deepStrictEqual(parent.children, [ child ]);
    assert.strictEqual(child.parent, parent);
  });
});
