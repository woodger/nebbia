"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const reader_1 = require("./reader");
(0, node_test_1.describe)('compiler reader helpers', () => {
    (0, node_test_1.describe)('readBalanced', () => {
        (0, node_test_1.test)('reads nested balanced content', () => {
            const template = 'x(a(b)c)y';
            const result = (0, reader_1.readBalanced)(template, 1, '(', ')', 1);
            strict_1.default.deepStrictEqual(result, {
                value: 'a(b)c',
                end: 7
            });
        });
        (0, node_test_1.test)('keeps closing delimiters inside quoted conditions', () => {
            const template = 'if (arg === ")") {body}';
            const result = (0, reader_1.readBalanced)(template, template.indexOf('('), '(', ')', 1);
            strict_1.default.deepStrictEqual(result, {
                value: 'arg === ")"',
                end: template.indexOf(') {')
            });
        });
        (0, node_test_1.test)('keeps closing braces inside quoted nested expressions', () => {
            const template = '{<i>${arg === "}" ? "brace" : ""}</i>}';
            const result = (0, reader_1.readBalanced)(template, 0, '{', '}', 2);
            strict_1.default.deepStrictEqual(result, {
                value: '<i>${arg === "}" ? "brace" : ""}</i>',
                end: template.length - 1
            });
        });
        (0, node_test_1.test)('returns the last index for an unclosed fragment', () => {
            const template = '${arg';
            const result = (0, reader_1.readBalanced)(template, 1, '{', '}', 1);
            strict_1.default.deepStrictEqual(result, {
                value: 'arg',
                end: template.length - 1
            });
        });
    });
    (0, node_test_1.describe)('readBalancedAfter', () => {
        (0, node_test_1.test)('skips whitespace before balanced content', () => {
            const template = 'if   (arg)';
            const result = (0, reader_1.readBalancedAfter)(template, 2, '(', ')', 1);
            strict_1.default.deepStrictEqual(result, {
                value: 'arg',
                end: template.length - 1
            });
        });
    });
    (0, node_test_1.describe)('readQuoted', () => {
        (0, node_test_1.test)('reads quoted content with escaped characters', () => {
            const template = '"a\\"}b" tail';
            const result = (0, reader_1.readQuoted)(template, 0);
            strict_1.default.deepStrictEqual(result, {
                value: '"a\\"}b"',
                end: 6
            });
        });
        (0, node_test_1.test)('returns the last index for an unclosed quoted fragment', () => {
            const template = '`value';
            const result = (0, reader_1.readQuoted)(template, 0);
            strict_1.default.deepStrictEqual(result, {
                value: '`value',
                end: template.length - 1
            });
        });
    });
    (0, node_test_1.describe)('skipWhitespace', () => {
        (0, node_test_1.test)('returns the first non-whitespace index', () => {
            strict_1.default.strictEqual((0, reader_1.skipWhitespace)('  \n\tvalue', 0), 4);
        });
    });
    (0, node_test_1.describe)('skipOptionalSemicolon', () => {
        (0, node_test_1.test)('returns the semicolon index when a semicolon follows whitespace', () => {
            const template = 'while (arg) ; next';
            const start = template.indexOf(')');
            strict_1.default.strictEqual((0, reader_1.skipOptionalSemicolon)(template, start), template.indexOf(';'));
        });
        (0, node_test_1.test)('keeps the start index when no semicolon follows', () => {
            const template = 'while (arg) next';
            const start = template.indexOf(')');
            strict_1.default.strictEqual((0, reader_1.skipOptionalSemicolon)(template, start), start);
        });
    });
    (0, node_test_1.describe)('isQuote', () => {
        (0, node_test_1.test)('recognizes JavaScript quote characters', () => {
            strict_1.default.strictEqual((0, reader_1.isQuote)('\''), true);
            strict_1.default.strictEqual((0, reader_1.isQuote)('"'), true);
            strict_1.default.strictEqual((0, reader_1.isQuote)('`'), true);
            strict_1.default.strictEqual((0, reader_1.isQuote)('x'), false);
        });
    });
});
//# sourceMappingURL=reader.test.js.map