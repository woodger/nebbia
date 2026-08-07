import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import Statement from './statement';

describe('class Statement', () => {
  test('initializes default type and name', () => {
    const node = new Statement();

    assert.strictEqual(node.type, 2);
    assert.strictEqual(node.name, '');
  });
});
