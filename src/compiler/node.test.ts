import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import Node from './node';

describe('class Node', () => {
  test('exports constructor function', () => {
    assert.strictEqual(typeof Node, 'function');
  });
});
