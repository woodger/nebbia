"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const nebbia_1 = __importDefault(require("./nebbia"));
function compileTemplate(template, ...params) {
    const literal = (0, nebbia_1.default)(template);
    return new Function(...params, `return ${literal}`);
}
function assertThrowsError(fn, message) {
    try {
        fn();
    }
    catch (error) {
        if (!(error instanceof Error)) {
            strict_1.default.fail(`Expected Error, got ${String(error)}`);
        }
        strict_1.default.strictEqual(error.constructor, Error);
        strict_1.default.strictEqual(error.message, message);
        return;
    }
    strict_1.default.fail('Expected function to throw an Error');
}
(0, node_test_1.describe)('#nebbia()', () => {
    (0, node_test_1.describe)('JavaScript statements', () => {
        (0, node_test_1.test)('translates if statements', () => {
            const invoke = compileTemplate('${if (arg) {<i>${arg}</i>}}', 'arg');
            strict_1.default.strictEqual(invoke(), '');
            strict_1.default.strictEqual(invoke(1), '<i>1</i>');
        });
        (0, node_test_1.test)('translates if...else statements', () => {
            const invoke = compileTemplate('${if (arg) {<i>${arg}</i>} else {<i>default</i>}}', 'arg');
            strict_1.default.strictEqual(invoke(1), '<i>1</i>');
            strict_1.default.strictEqual(invoke(), '<i>default</i>');
        });
        (0, node_test_1.test)('translates for statements', () => {
            const invoke = compileTemplate('${for (let i = 0; i < arg; i++) {<i>${i}</i>}}', 'arg');
            strict_1.default.strictEqual(invoke(2), '<i>0</i><i>1</i>');
        });
        (0, node_test_1.test)('translates for...in statements', () => {
            const invoke = compileTemplate('${for (let i in arg) {<i>${i}</i>}}', 'arg');
            strict_1.default.strictEqual(invoke({
                foo: 1,
                bar: 2
            }), '<i>foo</i><i>bar</i>');
        });
        (0, node_test_1.test)('translates for...of statements', () => {
            const invoke = compileTemplate('${for (let i of arg) {<i>${i}</i>}}', 'arg');
            strict_1.default.strictEqual(invoke([0, 1]), '<i>0</i><i>1</i>');
        });
        (0, node_test_1.test)('translates while statements', () => {
            const invoke = compileTemplate('${while (arg-- > 0) {<i>${arg}</i>}}', 'arg');
            strict_1.default.strictEqual(invoke(2), '<i>1</i><i>0</i>');
        });
    });
    (0, node_test_1.describe)('JavaScript syntax', () => {
        (0, node_test_1.test)('handles expressions', () => {
            const invoke = compileTemplate('${if (arg.toString()) {<i>${arg}</i>}}', 'arg');
            strict_1.default.strictEqual(invoke(1), '<i>1</i>');
        });
        (0, node_test_1.test)('handles array destructuring', () => {
            const invoke = compileTemplate('${for (let [i] of arg) {<i>${i}</i>}}', 'arg');
            strict_1.default.strictEqual(invoke([
                [0],
                [1]
            ]), '<i>0</i><i>1</i>');
        });
        (0, node_test_1.test)('handles object destructuring', () => {
            const invoke = compileTemplate('${for (let {i} of arg) {<i>${i}</i>}}', 'arg');
            strict_1.default.strictEqual(invoke([
                { i: 0 },
                { i: 1 }
            ]), '<i>0</i><i>1</i>');
        });
        (0, node_test_1.test)('handles object destructuring defaults', () => {
            const invoke = compileTemplate('${for (let {i = 0} of arg) {<i>${i}</i>}}', 'arg');
            strict_1.default.strictEqual(invoke([
                { m: 0 },
                { i: 1 }
            ]), '<i>0</i><i>1</i>');
        });
        (0, node_test_1.test)('throws when statement condition is empty', () => {
            assertThrowsError(() => (0, nebbia_1.default)('${for () {<i></i>}}'), 'Statement "for" must include content between parentheses');
        });
        (0, node_test_1.test)('throws when statement body is empty', () => {
            assertThrowsError(() => (0, nebbia_1.default)('${for (true) {}}'), 'Statement "for" must include template content inside braces');
        });
    });
    (0, node_test_1.describe)('Nested expressions', () => {
        (0, node_test_1.test)('renders a for statement inside an if statement', () => {
            const invoke = compileTemplate('${if (arg) {<p>${for (let i of arg) {<i>${i}</i>}}</p>}}', 'arg');
            strict_1.default.strictEqual(invoke([0, 1]), '<p><i>0</i><i>1</i></p>');
        });
        (0, node_test_1.test)('renders an if statement inside a while statement', () => {
            const invoke = compileTemplate('${while (arg.pop() > -1) {<p>${if (arg.length > 0) ' +
                '{<i>${arg.length}</i>}}</p>}}', 'arg');
            strict_1.default.strictEqual(invoke([0, 1]), '<p><i>1</i></p><p></p>');
        });
    });
    (0, node_test_1.describe)('Multiple statements', () => {
        (0, node_test_1.test)('renders if statements with following expressions', () => {
            const invoke = compileTemplate('${if (arg === true) {<i>1</i>} hello}', 'arg', 'hello');
            strict_1.default.strictEqual(invoke(true, 'Hello, World!'), '<i>1</i>Hello, World!');
        });
        (0, node_test_1.test)('renders if...else statements with preceding expressions', () => {
            const invoke = compileTemplate('${hello if (arg === true) {<i>1</i>} else {<i>0</i>}}', 'arg', 'hello');
            strict_1.default.strictEqual(invoke(false, 'Hello, World!'), 'Hello, World!<i>0</i>');
        });
        (0, node_test_1.test)('renders for statements with preceding expressions', () => {
            const invoke = compileTemplate('${hello for (let i = 0; i < 1; i++) {<i>${i}</i>}}', 'hello');
            strict_1.default.strictEqual(invoke('Hello, World!'), 'Hello, World!<i>0</i>');
        });
        (0, node_test_1.test)('renders for...in statements with preceding expressions', () => {
            const invoke = compileTemplate('${hello for (let i in arg) {<i>${i}</i>}}', 'arg', 'hello');
            strict_1.default.strictEqual(invoke({
                foo: 1,
                bar: 2
            }, 'Hello, World!'), 'Hello, World!<i>foo</i><i>bar</i>');
        });
        (0, node_test_1.test)('renders for...of statements with preceding expressions', () => {
            const invoke = compileTemplate('${hello for (let i of arg) {<i>${i}</i>}}', 'arg', 'hello');
            strict_1.default.strictEqual(invoke([1], 'Hello, World!'), 'Hello, World!<i>1</i>');
        });
        (0, node_test_1.test)('renders while statements with preceding expressions', () => {
            const invoke = compileTemplate('${hello while (arg.pop() > 0) {<i>${arg.length}</i>}}', 'arg', 'hello');
            strict_1.default.strictEqual(invoke([0, 1, 2], 'Hello, World!'), 'Hello, World!<i>2</i><i>1</i>');
        });
    });
    (0, node_test_1.describe)('Exceptional parser behavior', () => {
        (0, node_test_1.test)('throws when an expression uses the reserved unity marker', () => {
            assertThrowsError(() => (0, nebbia_1.default)('<i>${' + nebbia_1.default.Node.unity + '}</i>'), `Reserved expression marker "${nebbia_1.default.Node.unity}" cannot be used in templates`);
        });
        (0, node_test_1.test)('renders empty expressions as empty text', () => {
            const invoke = compileTemplate('<i>${}</i>');
            strict_1.default.strictEqual(invoke(), '<i></i>');
        });
        (0, node_test_1.test)('preserves standalone dollar characters', () => {
            const invoke = compileTemplate('<i>$</i>', 'arg');
            strict_1.default.strictEqual(invoke(), '<i>$</i>');
        });
        (0, node_test_1.test)('preserves repeated standalone dollar characters', () => {
            const invoke = compileTemplate('<i>$$</i>', 'arg');
            strict_1.default.strictEqual(invoke(), '<i>$$</i>');
        });
        (0, node_test_1.test)('keeps a dollar before an expression as text', () => {
            const invoke = compileTemplate('<i>$${arg}</i>', 'arg');
            strict_1.default.strictEqual(invoke(''), '<i>$</i>');
        });
        (0, node_test_1.test)('keeps a dollar after an expression as text', () => {
            const invoke = compileTemplate('<i>${arg}$</i>', 'arg');
            strict_1.default.strictEqual(invoke(''), '<i>$</i>');
        });
        (0, node_test_1.test)('allows spaces around nested expressions', () => {
            const invoke = compileTemplate('${ if (arg > 0) {<i>${ arg }</i>} }', 'arg');
            strict_1.default.strictEqual(invoke(1), '<i>1</i>');
        });
        (0, node_test_1.test)('allows spaces before a closing expression brace', () => {
            const invoke = compileTemplate('${if (arg > 0) {<i>${arg }</i>} }', 'arg');
            strict_1.default.strictEqual(invoke(1), '<i>1</i>');
        });
        (0, node_test_1.test)('allows spaces after an opening expression brace', () => {
            const invoke = compileTemplate('${ if (arg > 0) {<i>${ arg }</i>}}', 'arg');
            strict_1.default.strictEqual(invoke(1), '<i>1</i>');
        });
        (0, node_test_1.test)('parses statements without spaces before expressions', () => {
            const invoke = compileTemplate('${for(let i in arg){<i>${i}</i>}}', 'arg');
            strict_1.default.strictEqual(invoke({
                foo: 1,
                bar: 2
            }), '<i>foo</i><i>bar</i>');
        });
        (0, node_test_1.test)('ignores closing delimiters inside template strings', () => {
            const invoke = compileTemplate('${if (arg === `")"`) {<i>bracket</i>}}', 'arg');
            strict_1.default.strictEqual(invoke(`)`), '<i>bracket</i>');
        });
    });
});
//# sourceMappingURL=nebbia.test.js.map