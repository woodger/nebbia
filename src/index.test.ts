import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import compiler, { Expression, Node, Statement, Text, parse } from './compiler';
import nebbia from './index';

describe('interface module', () => {
  test('is backwards compatible with require', () => {
    // biome-ignore lint/style/noCommonJs: Verifies CommonJS compatibility.
    assert.strictEqual(require('nebbia'), nebbia);
  });

  test('is compatible with ECMAScript module default imports', async () => {
    const importPackage = new Function('return import("nebbia")') as () => Promise<{
      default: typeof nebbia;
    }>;
    const imported = await importPackage();

    assert.strictEqual(imported.default, nebbia);
  });

  test('rejects unsupported deep imports', () => {
    assert.throws(
      () => {
        // biome-ignore lint/style/noCommonJs: Verifies the public CommonJS package boundary.
        require('nebbia/dist/compiler');
      },
      {
        code: 'ERR_PACKAGE_PATH_NOT_EXPORTED'
      }
    );
  });

  test('exports callable compiler', () => {
    assert.strictEqual(typeof nebbia, 'function');
  });

  test('uses the compiler implementation', () => {
    assert.strictEqual(nebbia, compiler);
  });

  test('exposes public compiler contracts', () => {
    // biome-ignore lint/style/noCommonJs: Verifies CommonJS compatibility.
    const required = require('nebbia');

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
