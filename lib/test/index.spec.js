"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const src_1 = __importDefault(require("../src"));
describe('Interaface module', () => {
    it('Positive: Must be backwards compatible with #require', () => {
        assert_1.default(require('../src') === src_1.default);
    });
    it('Positive: The module must provide a function type', () => {
        assert_1.default(typeof src_1.default === 'function');
    });
    it('Positive: The module must contain a "#parse()" function', () => {
        assert_1.default(typeof src_1.default.parse === 'function');
    });
});
describe('#nebbia()', () => {
    describe('JavaScript statements', () => {
        it('Positive: The method should perform an operator translation of "if"', () => {
            const template = '${if (arg) {<i>${arg}</i>}}';
            const literal = src_1.default(template);
            const invoke = new Function('arg', `return ${literal}`);
            assert_1.default(invoke() === '');
            assert_1.default(invoke(1) === '<i>1</i>');
        });
        it('Positive: The method should perform an operator translation of "if...else"', () => {
            const template = '${if (arg) {<i>${arg}</i>} else {<i>default</i>}}';
            const literal = src_1.default(template);
            const invoke = new Function('arg', `return ${literal}`);
            assert_1.default(invoke(1) === '<i>1</i>');
            assert_1.default(invoke() === '<i>default</i>');
        });
        it('Positive: The method should perform an operator translation of "for"', () => {
            const template = '${for (let i = 0; i < arg; i++) {<i>${i}</i>}}';
            const literal = src_1.default(template);
            const invoke = new Function('arg', `return ${literal}`);
            assert_1.default(invoke(2) === '<i>0</i><i>1</i>');
        });
        it('Positive: The method should perform an operator translation of "for..in"', () => {
            const template = '${for (let i in arg) {<i>${i}</i>}}';
            const literal = src_1.default(template);
            const invoke = new Function('arg', `return ${literal}`);
            const res = invoke({
                foo: 1,
                bar: 2
            });
            assert_1.default(res === '<i>foo</i><i>bar</i>');
        });
        it('Positive: The method should perform an operator translation of "for..of"', () => {
            const template = '${for (let i of arg) {<i>${i}</i>}}';
            const literal = src_1.default(template);
            const invoke = new Function('arg', `return ${literal}`);
            assert_1.default(invoke([0, 1]) === '<i>0</i><i>1</i>');
        });
        it('Positive: The method should perform an operator translation of "while"', () => {
            const template = '${while (arg-- > 0) {<i>${arg}</i>}}';
            const literal = src_1.default(template);
            const invoke = new Function('arg', `return ${literal}`);
            assert_1.default(invoke(2) === '<i>1</i><i>0</i>');
        });
    });
    describe('JavaScript syntax test group', () => {
        it('Positive: The parser must handle expressions', () => {
            const template = '${if (arg.toString()) {<i>${arg}</i>}}';
            const literal = src_1.default(template);
            const invoke = new Function('arg', `return ${literal}`);
            assert_1.default(invoke(1) === '<i>1</i>');
        });
        it('Positive: The parser must handle Array destructuring', () => {
            const template = '${for (let [i] of arg) {<i>${i}</i>}}';
            const literal = src_1.default(template);
            const invoke = new Function('arg', `return ${literal}`);
            const res = invoke([
                [0],
                [1]
            ]);
            assert_1.default(res === '<i>0</i><i>1</i>');
        });
        it('Positive: The parser must handle Object destructuring', () => {
            const template = '${for (let {i} of arg) {<i>${i}</i>}}';
            const literal = src_1.default(template);
            const invoke = new Function('arg', `return ${literal}`);
            const res = invoke([
                { i: 0 },
                { i: 1 }
            ]);
            assert_1.default(res === '<i>0</i><i>1</i>');
        });
        it('Positive: The parser must handle destructuring assignment Object', () => {
            const template = '${for (let {i = 0} of arg) {<i>${i}</i>}}';
            const literal = src_1.default(template);
            const invoke = new Function('arg', `return ${literal}`);
            const res = invoke([
                { m: 0 },
                { i: 1 }
            ]);
            assert_1.default(res === '<i>0</i><i>1</i>');
        });
        it('Negative: Throw an exception if the condition is empty', () => {
            assert_1.default.throws(() => {
                src_1.default('${for () {<i></i>}}');
            });
        });
        it('Negative: Throw an exception if the expression does follow the statement', () => {
            assert_1.default.throws(() => {
                src_1.default('${for (true) {}}');
            });
        });
    });
    describe('Nested expressions', () => {
        it(`Positive: The statements 'for' is in a statements 'if'`, () => {
            const template = '${if (arg) {<p>${for (let i of arg) {<i>${i}</i>}}</p>}}';
            const literal = src_1.default(template);
            const invoke = new Function('arg', `return ${literal}`);
            const res = invoke([0, 1]);
            assert_1.default(res === '<p><i>0</i><i>1</i></p>');
        });
        it('Positive: The statements "if" is in a statements "while"', () => {
            const template = '${while (arg.pop() > -1) {<p>${if (arg.length > 0) ' +
                '{<i>${arg.length}</i>}}</p>}}';
            const literal = src_1.default(template);
            const invoke = new Function('arg', `return ${literal}`);
            const res = invoke([0, 1]);
            assert_1.default(res === '<p><i>1</i></p><p></p>');
        });
    });
    describe('Multiple statements', () => {
        it('Positive: The operator translation of "if" with other expression"', () => {
            const template = '${if (arg === true) {<i>1</i>} hello}';
            const literal = src_1.default(template);
            const invoke = new Function('arg', 'hello', `return ${literal}`);
            const res = invoke(true, 'Hello, World!');
            assert_1.default(res === '<i>1</i>Hello, World!');
        });
        it('Positive: The operator translation of "if...else" with other expression', () => {
            const template = '${hello if (arg === true) {<i>1</i>} else {<i>0</i>}}';
            const literal = src_1.default(template);
            const invoke = new Function('arg', 'hello', `return ${literal}`);
            const res = invoke(false, 'Hello, World!');
            assert_1.default(res === 'Hello, World!<i>0</i>');
        });
        it('Positive: The operator translation of "for" with other expression', () => {
            const template = '${hello for (let i = 0; i < 1; i++) {<i>${i}</i>}}';
            const literal = src_1.default(template);
            const invoke = new Function('hello', `return ${literal}`);
            const res = invoke('Hello, World!');
            assert_1.default(res === 'Hello, World!<i>0</i>');
        });
        it('Positive: The operator translation of "for...in" with other expression', () => {
            const template = '${hello for (let i in arg) {<i>${i}</i>}}';
            const literal = src_1.default(template);
            const invoke = new Function('arg', 'hello', `return ${literal}`);
            const res = invoke({
                foo: 1,
                bar: 2
            }, 'Hello, World!');
            assert_1.default(res === 'Hello, World!<i>foo</i><i>bar</i>');
        });
        it('Positive: The operator translation of "for...of" with other expression', () => {
            const template = '${hello for (let i of arg) {<i>${i}</i>}}';
            const literal = src_1.default(template);
            const invoke = new Function('arg', 'hello', `return ${literal}`);
            const res = invoke([1], 'Hello, World!');
            assert_1.default(res, 'Hello, World!<i>1</i>');
        });
        it('Positive: The operator translation of "while" with other expression', () => {
            const template = '${hello while (arg.pop() > 0) {<i>${arg.length}</i>}}';
            const literal = src_1.default(template);
            const invoke = new Function('arg', 'hello', `return ${literal}`);
            const res = invoke([0, 1, 2], 'Hello, World!');
            assert_1.default(res, 'Hello, World!<i>2</i><i>1</i>');
        });
    });
    describe('Exceptional parser behavior', () => {
        it('Negative: When using a reserved keyword in a pattern string expression, ' +
            'should throw an exception', () => {
            assert_1.default.throws(() => {
                src_1.default('<i>${' + src_1.default.Node.unity + '}</i>');
            });
        });
        it('Positive: Do not throw an exception when the expression is empty', () => {
            const template = '<i>${}</i>';
            const literal = src_1.default(template);
            const invoke = new Function(`return ${literal}`);
            assert_1.default(invoke() === '<i></i>');
        });
        it('Positive: The parser must skip the "$" character without the bracket "{". Case 1', () => {
            const template = '<i>$</i>';
            const literal = src_1.default(template);
            const invoke = new Function('arg', `return ${literal}`);
            assert_1.default(invoke() === '<i>$</i>');
        });
        it('Positive: The parser must skip the "$" character without the bracket "{". Case 2', () => {
            const template = '<i>$$</i>';
            const literal = src_1.default(template);
            const invoke = new Function('arg', `return ${literal}`);
            assert_1.default(invoke() === '<i>$$</i>');
        });
        it('Positive: The parser must skip the "$" character without the bracket "{". Case 3', () => {
            const template = '<i>$${arg}</i>';
            const literal = src_1.default(template);
            const invoke = new Function('arg', `return ${literal}`);
            assert_1.default(invoke('') === '<i>$</i>');
        });
        it('Positive: The parser must skip the "$" character without the bracket "{". Case 4', () => {
            const template = '<i>${arg}$</i>';
            const literal = src_1.default(template);
            const invoke = new Function('arg', `return ${literal}`);
            assert_1.default(invoke('') === '<i>$</i>');
        });
        it('Positive: The parser must skip the space character inside an expression. Case 1', () => {
            const template = '${ if (arg > 0) {<i>${ arg }</i>} }';
            const literal = src_1.default(template);
            const invoke = new Function('arg', `return ${literal}`);
            assert_1.default(invoke(1) === '<i>1</i>');
        });
        it('Positive: The parser must skip the space character inside an expression. Case 2', () => {
            const template = '${if (arg > 0) {<i>${arg }</i>} }';
            const literal = src_1.default(template);
            const invoke = new Function('arg', `return ${literal}`);
            assert_1.default(invoke(1) === '<i>1</i>');
        });
        it('Positive: The parser must skip the space character inside an expression. Case 3', () => {
            const template = '${ if (arg > 0) {<i>${ arg }</i>}}';
            const literal = src_1.default(template);
            const invoke = new Function('arg', `return ${literal}`);
            assert_1.default(invoke(1) === '<i>1</i>');
        });
        it('Positive: The parser should not consider the space before the expression', () => {
            const template = '${for(let i in arg){<i>${i}</i>}}';
            const literal = src_1.default(template);
            const invoke = new Function('arg', `return ${literal}`);
            const res = invoke({
                foo: 1,
                bar: 2
            });
            assert_1.default(res === '<i>foo</i><i>bar</i>');
        });
        it('Positive: The parser must skip lines enclosed "\`" in a inside an expression', () => {
            const template = '${if (arg === `")"`) {<i>bracket</i>}}';
            const literal = src_1.default(template);
            const invoke = new Function('arg', `return ${literal}`);
            assert_1.default(invoke(`)`) === '<i>bracket</i>');
        });
    });
});
//# sourceMappingURL=index.spec.js.map