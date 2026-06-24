import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
  isQuote,
  readBalanced,
  readBalancedAfter,
  readQuoted,
  skipOptionalSemicolon,
  skipWhitespace
} from './reader';

describe('compiler reader helpers', () => {
  describe('readBalanced', () => {
    test('reads nested balanced content', () => {
      const template = 'x(a(b)c)y';
      const result = readBalanced(template, 1, '(', ')', 1);

      assert.deepStrictEqual(result, {
        value: 'a(b)c',
        end: 7
      });
    });

    test('keeps closing delimiters inside quoted conditions', () => {
      const template = 'if (arg === ")") {body}';
      const result = readBalanced(template, template.indexOf('('), '(', ')', 1);

      assert.deepStrictEqual(result, {
        value: 'arg === ")"',
        end: template.indexOf(') {')
      });
    });

    test('keeps closing braces inside quoted nested expressions', () => {
      const template = '{<i>${arg === "}" ? "brace" : ""}</i>}';
      const result = readBalanced(template, 0, '{', '}', 2);

      assert.deepStrictEqual(result, {
        value: '<i>${arg === "}" ? "brace" : ""}</i>',
        end: template.length - 1
      });
    });

    test('returns the last index for an unclosed fragment', () => {
      const template = '${arg';
      const result = readBalanced(template, 1, '{', '}', 1);

      assert.deepStrictEqual(result, {
        value: 'arg',
        end: template.length - 1
      });
    });
  });

  describe('readBalancedAfter', () => {
    test('skips whitespace before balanced content', () => {
      const template = 'if   (arg)';
      const result = readBalancedAfter(template, 2, '(', ')', 1);

      assert.deepStrictEqual(result, {
        value: 'arg',
        end: template.length - 1
      });
    });
  });

  describe('readQuoted', () => {
    test('reads quoted content with escaped characters', () => {
      const template = '"a\\"}b" tail';
      const result = readQuoted(template, 0);

      assert.deepStrictEqual(result, {
        value: '"a\\"}b"',
        end: 6
      });
    });

    test('returns the last index for an unclosed quoted fragment', () => {
      const template = '`value';
      const result = readQuoted(template, 0);

      assert.deepStrictEqual(result, {
        value: '`value',
        end: template.length - 1
      });
    });
  });

  describe('skipWhitespace', () => {
    test('returns the first non-whitespace index', () => {
      assert.strictEqual(skipWhitespace('  \n\tvalue', 0), 4);
    });
  });

  describe('skipOptionalSemicolon', () => {
    test('returns the semicolon index when a semicolon follows whitespace', () => {
      const template = 'while (arg) ; next';
      const start = template.indexOf(')');

      assert.strictEqual(skipOptionalSemicolon(template, start), template.indexOf(';'));
    });

    test('keeps the start index when no semicolon follows', () => {
      const template = 'while (arg) next';
      const start = template.indexOf(')');

      assert.strictEqual(skipOptionalSemicolon(template, start), start);
    });
  });

  describe('isQuote', () => {
    test('recognizes JavaScript quote characters', () => {
      assert.strictEqual(isQuote('\''), true);
      assert.strictEqual(isQuote('"'), true);
      assert.strictEqual(isQuote('`'), true);
      assert.strictEqual(isQuote('x'), false);
    });
  });
});
