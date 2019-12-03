const assert = require('assert');
const nebbia = require('..');

describe('Interaface module', () => {
  it('The module must provide a function type', () => {
    assert(typeof nebbia === 'function');
  });

  it('The module must contain a "#parse()" function', () => {
    assert(typeof nebbia.parse === 'function');
  });
});

describe('#nebbia()', () => {
  describe('JavaScript statements', () => {
    it('The method should perform an operator translation of "if"', () => {
      const template = '${if (arg) {<i>${arg}</i>}}';
      const invoke = new Function('arg', 'return ' + nebbia(template));
      const def = invoke();
      const res = invoke(1);

      assert(def === '');
      assert(res === '<i>1</i>');
    });

    it(
      'The method should perform an operator translation of "if...else"',
    () => {
      const template = '${if (arg) {<i>${arg}</i>} else {<i>default</i>}}';
      const invoke = new Function('arg', 'return ' + nebbia(template));
      const res = invoke(1);
      const def = invoke();

      assert(
        res === '<i>1</i>' &&
        def === '<i>default</i>'
      );
    });

    it('The method should perform an operator translation of "for"', () => {
      const template = '${for (let i = 0; i < arg; i++) {<i>${i}</i>}}';
      const invoke = new Function('arg', 'return ' + nebbia(template));
      const res = invoke(2);

      assert(res === '<i>0</i><i>1</i>');
    });

    it('The method should perform an operator translation of "for..in"', () => {
      const template = '${for (let i in arg) {<i>${i}</i>}}';
      const invoke = new Function('arg', 'return ' + nebbia(template));
      const res = invoke({
        foo: 1,
        bar: 2
      });

      assert(res === '<i>foo</i><i>bar</i>');
    });

    it('The method should perform an operator translation of "for..of"', () => {
      const template = '${for (let i of arg) {<i>${i}</i>}}';
      const invoke = new Function('arg', 'return ' + nebbia(template));
      const res = invoke([ 0, 1 ]);

      assert(res === '<i>0</i><i>1</i>');
    });

    it('The method should perform an operator translation of "while"', () => {
      const template = '${while (arg-- > 0) {<i>${arg}</i>}}';
      const invoke = new Function('arg', 'return ' + nebbia(template));
      const res = invoke(2);

      assert(res === '<i>1</i><i>0</i>');
    });
  });

  describe('JavaScript syntax test group', () => {
    it('The first argument to the method is a string type', () => {
      try {
        nebbia();
      }
      catch (err) {
        assert(err.message === 'The method argument must be of string type');
      }
    });

    it('The parser must handle expressions', () => {
      const template = '${if (arg.toString()) {<i>${arg}</i>}}';
      const invoke = new Function('arg', 'return ' + nebbia(template));
      const res = invoke(1);

      assert(res === '<i>1</i>');
    });

    it('The parser must handle Array destructuring', () => {
      const template = '${for (let [i] of arg) {<i>${i}</i>}}';
      const invoke = new Function('arg', 'return ' + nebbia(template));
      const res = invoke([
        [ 0 ], [ 1 ]
      ]);

      assert(res === '<i>0</i><i>1</i>');
    });

    it('The parser must handle Object destructuring', () => {
      const template = '${for (let {i} of arg) {<i>${i}</i>}}';
      const invoke = new Function('arg', 'return ' + nebbia(template));
      const res = invoke([
        { i: 0 },
        { i: 1 }
      ]);

      assert(res === '<i>0</i><i>1</i>');
    });

    it('The parser must handle destructuring assignment Object', () => {
      const template = '${for (let {i = 0} of arg) {<i>${i}</i>}}';
      const invoke = new Function('arg', 'return ' + nebbia(template));
      const res = invoke([
        { m: 0 },
        { i: 1 }
      ]);

      assert(res === '<i>0</i><i>1</i>');
    });

    it('Throw an exception if the condition is empty', () => {
      try {
        nebbia('${for () {<i></i>}}');
      }
      catch (err) {
        assert(err.message === 'Unexpected token )');
      }
    });

    it('Throw an exception if the expression does follow the statement', () => {
      try {
        nebbia('${for (true) {}}');
      }
      catch (err) {
        assert(
          err.message === 'Template literal must start with a template head'
        );
      }
    });
  });

  describe('Nested expressions', () => {
    it(`The statements 'for' is in a statements 'if'`, () => {
      const template =
        '${if (arg) {<p>${for (let i of arg) {<i>${i}</i>}}</p>}}';

      const invoke = new Function('arg', 'return ' + nebbia(template));
      const res = invoke([ 0, 1 ]);

      assert(res === '<p><i>0</i><i>1</i></p>');
    });

    it('The statements "if" is in a statements "while"', () => {
      const template =
        '${while (arg.pop() > -1) {<p>${if (arg.length > 0) ' +
        '{<i>${arg.length}</i>}}</p>}}';

      const invoke = new Function('arg', 'return ' + nebbia(template));
      const res = invoke([ 0, 1 ]);

      assert(res === '<p><i>1</i></p><p></p>');
    });
  });

  describe('Multiple statements', () => {
    it('The operator translation of "if" with other expression"', () => {
      const template = '${if (arg === true) {<i>1</i>} hello}';
      const invoke = new Function('arg', 'hello', 'return ' + nebbia(template));
      const res = invoke(true, 'Hello, World!');

      assert(res === '<i>1</i>Hello, World!');
    });

    it('The operator translation of "if...else" with other expression', () => {
      const template = '${hello if (arg === true) {<i>1</i>} else {<i>0</i>}}';
      const invoke = new Function('arg', 'hello', 'return ' + nebbia(template));
      const res = invoke(false, 'Hello, World!');

      assert(res === 'Hello, World!<i>0</i>');
    });

    it('The operator translation of "for" with other expression', () => {
      const template = '${hello for (let i = 0; i < 1; i++) {<i>${i}</i>}}';
      const invoke = new Function('hello', 'return ' + nebbia(template));
      const res = invoke('Hello, World!');

      assert(res === 'Hello, World!<i>0</i>');
    });

    it('The operator translation of "for...in" with other expression', () => {
      const template = '${hello for (let i in arg) {<i>${i}</i>}}';
      const invoke = new Function('arg', 'hello', 'return ' + nebbia(template));

      const res = invoke({
        foo: 1,
        bar: 2
      }, 'Hello, World!');

      assert(res === 'Hello, World!<i>foo</i><i>bar</i>');
    });

    it('The operator translation of "for...of" with other expression', () => {
      const template = '${hello for (let i of arg) {<i>${i}</i>}}';
      const invoke = new Function('arg', 'hello', 'return ' + nebbia(template));
      const res = invoke([ 1 ], 'Hello, World!');

      assert(res, 'Hello, World!<i>1</i>');
    });

    it('The operator translation of "while" with other expression', () => {
      const template = '${hello while (arg.pop() > 0) {<i>${arg.length}</i>}}';
      const invoke = new Function('arg', 'hello', 'return ' + nebbia(template));
      const res = invoke([ 0, 1, 2 ], 'Hello, World!');

      assert(res, 'Hello, World!<i>2</i><i>1</i>');
    });
  });

  describe('Exceptional parser behavior', () => {
    it('String is a required argument', () => {
      try {
        nebbia();
      }
      catch (err) {
        assert(err.message === 'The method argument must be of string type');
      }
    });

    it(
      'When using a reserved keyword in a pattern string expression, ' +
      'should throw an exception',
    () => {
      try {
        nebbia('<i>${' + nebbia.Node.unity + '}</i>');
      }
      catch (err) {
        assert(err.message === `${nebbia.Node.unity} is reserved keyword`);
      }
    });

    it('Do not throw an exception when the expression is empty', () => {
      const template = '<i>${}</i>';
      const invoke = new Function('return ' + nebbia(template));
      const res = invoke();

      assert(res === '<i></i>');
    });

    it('The parser must skip the "$" character without the bracket "{"', () => {
      const template = '<i>$</i>';
      const invoke = new Function('arg', 'return ' + nebbia(template));
      const res = invoke();

      assert(res === template);

      const template1 = '<i>$$</i>';
      const invoke1 = new Function('arg', 'return ' + nebbia(template1));
      const res1 = invoke1();

      assert(res1 === template1);

      const template2 = '<i>$${arg}</i>';
      const invoke2 = new Function('arg', 'return ' + nebbia(template2));
      const res2 = invoke2('');

      assert(res2 === template);

      const template3 = '<i>${arg}$</i>';
      const invoke3 = new Function('arg', 'return ' + nebbia(template3));
      const res3 = invoke3('');

      assert(res3 === template);
    });

    it('The parser must skip the space character inside an expression', () => {
      const template = '${ if (arg > 0) {<i>${ arg }</i>} }';
      const invoke = new Function('arg', 'return ' + nebbia(template));
      const res = invoke(1);

      assert(res === '<i>1</i>');

      const template1 = '${if (arg > 0) {<i>${arg }</i>} }';
      const invoke1 = new Function('arg', 'return ' + nebbia(template1));
      const res1 = invoke1(1);

      assert(res1 === '<i>1</i>');

      const template2 = '${ if (arg > 0) {<i>${ arg }</i>}}';
      const invoke2 = new Function('arg', 'return ' + nebbia(template2));
      const res2 = invoke2(1);

      assert(res2 === '<i>1</i>');
    });

    it(
      'The parser should not consider the space before the expression', () => {
      const template = '${for(let i in arg){<i>${i}</i>}}';
      const invoke = new Function('arg', 'return ' + nebbia(template));

      const res = invoke({
        foo: 1,
        bar: 2
      });

      assert(res === '<i>foo</i><i>bar</i>');
    });

    it(
      'The parser must skip lines enclosed "\`" in a inside an expression',
    () => {
      const template = '${if (arg === `")"`) {<i>bracket</i>}}';
      const invoke = new Function('arg', 'return ' + nebbia(template));
      const res = invoke(`)`);

      assert(res === '<i>bracket</i>');
    });
  });
});
