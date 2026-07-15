import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import compiler, { Expression, Node, Statement, Text, parse } from './compiler';
import nebbia from './index';

describe('interface module', () => {
  test('is backwards compatible with require', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Verifies CommonJS compatibility.
    assert.strictEqual(require('./index'), nebbia);
  });

  test('exports callable compiler', () => {
    assert.strictEqual(typeof nebbia, 'function');
  });

  test('uses the compiler implementation', () => {
    assert.strictEqual(nebbia, compiler);
  });

  test('exposes public compiler contracts', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Verifies CommonJS compatibility.
    const required = require('./index');

    assert.strictEqual(typeof nebbia.parse, 'function');
    assert.strictEqual(typeof nebbia.Node, 'function');
    assert.strictEqual(typeof nebbia.Expression, 'function');
    assert.strictEqual(typeof nebbia.Statement, 'function');
    assert.strictEqual(typeof nebbia.Text, 'function');

    assert.strictEqual(nebbia.parse, parse);
    assert.strictEqual(nebbia.Node, Node);
    assert.strictEqual(nebbia.Expression, Expression);
    assert.strictEqual(nebbia.Statement, Statement);
    assert.strictEqual(nebbia.Text, Text);

    assert.strictEqual(required.parse, parse);
    assert.strictEqual(required.Node, Node);
    assert.strictEqual(required.Expression, Expression);
    assert.strictEqual(required.Statement, Statement);
    assert.strictEqual(required.Text, Text);
  });
});
