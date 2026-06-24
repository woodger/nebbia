import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import Text from './text';

describe('class Text', () => {
  test('exports constructor function', () => {
    assert.strictEqual(typeof Text, 'function');
  });

  test('initializes default type and name', () => {
    const node = new Text();

    assert.strictEqual(node.type, 1);
    assert.strictEqual(node.name, '#text');
  });
});
