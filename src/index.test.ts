import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import compiler, { Expression, Node, Statement, Text, parse } from './compiler';
import nebbia from './index';

describe('interface module', () => {
  test('is backwards compatible with require', () => {
    // Verifies CommonJS compatibility.
    // oxlint-disable-next-line import/no-commonjs, typescript/no-require-imports
    assert.strictEqual(require('nebbia'), nebbia);
  });

  test('is compatible with ECMAScript module default imports', async () => {
    // Prevents TypeScript from compiling the package import to CommonJS require().
    // oxlint-disable-next-line typescript/no-implied-eval
    const importPackage = new Function('return import("nebbia")') as () => Promise<{
      default: typeof nebbia;
    }>;
    const imported = await importPackage();

    assert.strictEqual(imported.default, nebbia);
  });

  test('rejects unsupported deep imports', () => {
    assert.throws(
      () => {
        // Verifies the public CommonJS package boundary.
        // oxlint-disable-next-line import/no-commonjs, typescript/no-require-imports
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
  });
});
