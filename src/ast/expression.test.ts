import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import Expression from './expression';

describe('class Expression', () => {
  test('exports constructor function', () => {
    assert.strictEqual(typeof Expression, 'function');
  });

  test('initializes default type and name', () => {
    const node = new Expression();

    assert.strictEqual(node.type, 0);
    assert.strictEqual(node.name, '#expression');
  });
});
