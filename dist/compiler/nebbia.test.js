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
        (0, node_test_1.test)('translates if...else if statements', () => {
            const invoke = compileTemplate('${if (arg === 1) {<i>one</i>} else if (arg === 2) {<i>two</i>}}', 'arg');
            strict_1.default.strictEqual(invoke(1), '<i>one</i>');
            strict_1.default.strictEqual(invoke(2), '<i>two</i>');
            strict_1.default.strictEqual(invoke(3), '');
        });
        (0, node_test_1.test)('translates if...else if...else statements', () => {
            const invoke = compileTemplate('${if (arg === 1) {<i>one</i>} else if (arg === 2) ' +
                '{<i>two</i>} else {<i>default</i>}}', 'arg');
            strict_1.default.strictEqual(invoke(1), '<i>one</i>');
            strict_1.default.strictEqual(invoke(2), '<i>two</i>');
            strict_1.default.strictEqual(invoke(3), '<i>default</i>');
        });
        (0, node_test_1.test)('translates chained if...else if statements', () => {
            const invoke = compileTemplate('${if (arg === 1) {<i>one</i>} else if (arg === 2) ' +
                '{<i>two</i>} else if (arg === 3) {<i>three</i>}}', 'arg');
            strict_1.default.strictEqual(invoke(1), '<i>one</i>');
            strict_1.default.strictEqual(invoke(2), '<i>two</i>');
            strict_1.default.strictEqual(invoke(3), '<i>three</i>');
            strict_1.default.strictEqual(invoke(4), '');
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
        (0, node_test_1.test)('translates do...while statements', () => {
            const invoke = compileTemplate('${do {<i>${arg}</i>} while (arg-- > 0)}', 'arg');
            strict_1.default.strictEqual(invoke(2), '<i>2</i><i>1</i><i>0</i>');
            strict_1.default.strictEqual(invoke(0), '<i>0</i>');
        });
        (0, node_test_1.test)('translates do...while statements with optional semicolon', () => {
            const invoke = compileTemplate('${do {<i>${arg}</i>} while (arg-- > 0);}', 'arg');
            strict_1.default.strictEqual(invoke(1), '<i>1</i><i>0</i>');
        });
        (0, node_test_1.test)('translates break statements inside for statements', () => {
            const invoke = compileTemplate('${for (let i = 0; i < arg; i++) {' +
                '${if (i === 2) {${break}}}<i>${i}</i>}}', 'arg');
            strict_1.default.strictEqual(invoke(4), '<i>0</i><i>1</i>');
        });
        (0, node_test_1.test)('translates continue statements inside for statements', () => {
            const invoke = compileTemplate('${for (let i = 0; i < arg; i++) {' +
                '${if (i % 2 === 0) {${continue;}}}<i>${i}</i>}}', 'arg');
            strict_1.default.strictEqual(invoke(5), '<i>1</i><i>3</i>');
        });
        (0, node_test_1.test)('translates break statements inside while statements', () => {
            const invoke = compileTemplate('${while (arg.length > 0) {' +
                '${if (arg[0] === 0) {${break}}}<i>${arg.shift()}</i>}}', 'arg');
            strict_1.default.strictEqual(invoke([2, 1, 0, 3]), '<i>2</i><i>1</i>');
        });
        (0, node_test_1.test)('translates continue statements inside while statements', () => {
            const invoke = compileTemplate('${while ((value = arg.shift()) !== undefined) {' +
                '${if (value === 0) {${continue}}}<i>${value}</i>}}', 'arg', 'value');
            strict_1.default.strictEqual(invoke([1, 0, 2]), '<i>1</i><i>2</i>');
        });
    });
    (0, node_test_1.describe)('JavaScript syntax', () => {
        (0, node_test_1.test)('handles expressions', () => {
            const invoke = compileTemplate('${if (arg.toString()) {<i>${arg}</i>}}', 'arg');
            strict_1.default.strictEqual(invoke(1), '<i>1</i>');
        });
        (0, node_test_1.test)('handles template literal expressions', () => {
            const invoke = compileTemplate('<i>${`value:${arg}`}</i>', 'arg');
            strict_1.default.strictEqual(invoke(1), '<i>value:1</i>');
        });
        (0, node_test_1.test)('ignores closing parentheses inside quoted statement conditions', () => {
            const doubleQuoted = compileTemplate('${if (arg === ")") {<i>double</i>}}', 'arg');
            const singleQuoted = compileTemplate('${if (arg === \')\') {<i>single</i>}}', 'arg');
            strict_1.default.strictEqual(doubleQuoted(')'), '<i>double</i>');
            strict_1.default.strictEqual(doubleQuoted('('), '');
            strict_1.default.strictEqual(singleQuoted(')'), '<i>single</i>');
            strict_1.default.strictEqual(singleQuoted('('), '');
        });
        (0, node_test_1.test)('ignores closing braces inside quoted statement conditions', () => {
            const doubleQuoted = compileTemplate('${if (arg === "}") {<i>double</i>}}', 'arg');
            const singleQuoted = compileTemplate('${if (arg === \'}\') {<i>single</i>}}', 'arg');
            strict_1.default.strictEqual(doubleQuoted('}'), '<i>double</i>');
            strict_1.default.strictEqual(doubleQuoted('{'), '');
            strict_1.default.strictEqual(singleQuoted('}'), '<i>single</i>');
            strict_1.default.strictEqual(singleQuoted('{'), '');
        });
        (0, node_test_1.test)('ignores closing braces inside quoted nested expressions', () => {
            const invoke = compileTemplate('${if (arg) {<i>${arg === "}" ? "brace" : ""}</i>}}', 'arg');
            strict_1.default.strictEqual(invoke('}'), '<i>brace</i>');
            strict_1.default.strictEqual(invoke('{'), '<i></i>');
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
        (0, node_test_1.test)('throws when do statement body is empty', () => {
            assertThrowsError(() => (0, nebbia_1.default)('${do {} while (true)}'), 'Statement "do" must include template content inside braces');
        });
        (0, node_test_1.test)('throws when do statement has no while condition', () => {
            assertThrowsError(() => (0, nebbia_1.default)('${do {<i></i>}}'), 'Statement "do" must include while condition');
        });
        (0, node_test_1.test)('throws when break statement is outside an iteration statement', () => {
            assertThrowsError(() => (0, nebbia_1.default)('${break}'), 'Statement "break" must be used inside iteration statements');
        });
        (0, node_test_1.test)('throws when continue statement is outside an iteration statement', () => {
            assertThrowsError(() => (0, nebbia_1.default)('${if (true) {${continue}}}'), 'Statement "continue" must be used inside iteration statements');
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
        (0, node_test_1.test)('renders an expression inside a do...while statement', () => {
            const invoke = compileTemplate('${do {<i>${arg.pop()}</i>} while (arg.length > 0)}', 'arg');
            strict_1.default.strictEqual(invoke([0, 1]), '<i>1</i><i>0</i>');
        });
        (0, node_test_1.test)('keeps break statements inside the nearest nested loop', () => {
            const invoke = compileTemplate('${for (let row of arg) {<p>${for (let value of row) {' +
                '${if (value === 0) {${break}}}<i>${value}</i>}}</p>}}', 'arg');
            strict_1.default.strictEqual(invoke([
                [1, 0, 2],
                [3, 4]
            ]), '<p><i>1</i></p><p><i>3</i><i>4</i></p>');
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
            strict_1.default.strictEqual(invoke(`")"`), '<i>bracket</i>');
            strict_1.default.strictEqual(invoke(`)`), '');
        });
        (0, node_test_1.test)('rejects template delimiters inside unsupported JavaScript fragments', () => {
            strict_1.default.throws(() => compileTemplate('${if (/}/.test(arg)) {<i>yes</i>}}', 'arg'), Error);
            strict_1.default.throws(() => compileTemplate('${if (arg /* ) */) {<i>yes</i>}}', 'arg'), Error);
        });
        (0, node_test_1.test)('preserves break and continue words as template text', () => {
            const invoke = compileTemplate('${for (let i = 0; i < 1; i++) {break continue}}');
            strict_1.default.strictEqual(invoke(), 'break continue');
        });
    });
});
//# sourceMappingURL=nebbia.test.js.map