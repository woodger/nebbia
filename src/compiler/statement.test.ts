import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import Statement from './statement';

describe('class Statement', () => {
  test('exports constructor function', () => {
    assert.strictEqual(typeof Statement, 'function');
  });

  test('initializes default type and name', () => {
    const node = new Statement();

    assert.strictEqual(node.type, 2);
    assert.strictEqual(node.name, '');
  });
});
