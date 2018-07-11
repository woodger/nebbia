const assert = require('assert');
const nebbia = require('..');



describe(`Interaface`, () => {
  it(`The module must provide a function type`, () => {
    assert.strictEqual(typeof nebbia, 'function');
  });

  it(`The module must contain a '#parse()' function`, () => {
    assert.strictEqual(typeof nebbia.parse, 'function');
  });

  it(`The module must contain 'class Node' for building a syntax tree`, () => {
    assert.strictEqual(typeof nebbia.Node, 'function');
  });

  it(`'Expression', 'Text' and 'Statement' must extentds 'class Node'`, () => {
    assert(nebbia.Node.isPrototypeOf(nebbia.Expression));
    assert(nebbia.Node.isPrototypeOf(nebbia.Text));
    assert(nebbia.Node.isPrototypeOf(nebbia.Statement));
  });

  it(`Interaface 'constructor: new Node'`, () => {
    let node = new nebbia.Node();

    assert.strictEqual(node.type, null);
    assert.strictEqual(node.name, null);
    assert.strictEqual(node.parent, null);
    assert.strictEqual(node.value, '');
    assert(node.childs instanceof Array);
  });

  it(`Interaface 'constructor: new Expression'`, () => {
    let node = new nebbia.Expression();

    assert.strictEqual(node.type, 0);
    assert.strictEqual(node.name, '#expression');
  });

  it(`Interaface 'constructor: new Text'`, () => {
    let node = new nebbia.Text();

    assert.strictEqual(node.type, 1);
    assert.strictEqual(node.name, '#text');
  });

  it(`Interaface 'constructor: new Statement'`, () => {
    let node = new nebbia.Statement();

    assert.strictEqual(node.type, 2);
  });
});



describe(`#nebbia()`, () => {
  describe(`JavaScript statements`, () => {
    it(`The method should perform an operator translation of 'if'`, () => {
      let template =
      '${if (arg) {<i>${arg}</i>}}';

      let invoke = new Function('arg', 'return ' + nebbia(template));

      assert.strictEqual(invoke(), '');
      assert.strictEqual(
        invoke(1),
        '<i>1</i>'
      );
    });

    it(`The method should perform an operator translation of 'if...else'`, () => {
      let template =
      '${if (arg) {<i>${arg}</i>} else {<i>default</i>}}';

      let invoke = new Function('arg', 'return ' + nebbia(template));

      assert.strictEqual(
        invoke(1),
        '<i>1</i>'
      );
      assert.strictEqual(
        invoke(),
        '<i>default</i>'
      );
    });

    it(`The method should perform an operator translation of 'for'`, () => {
      let template =
      '${for (let i = 0; i < arg; i++) {<i>${i}</i>}}';

      let invoke = new Function('arg', 'return ' + nebbia(template));

      assert.strictEqual(
        invoke(2),
        '<i>0</i><i>1</i>'
      );
    });

    it(`The method should perform an operator translation of 'for..in'`, () => {
      let template =
      '${for (let i in arg) {<i>${i}</i>}}';

      let invoke = new Function('arg', 'return ' + nebbia(template));

      assert.strictEqual(
        invoke({foo: 1, bar: 2}),
        '<i>foo</i><i>bar</i>'
      );
    });

    it(`The method should perform an operator translation of 'for..of'`, () => {
      let template =
      '${for (let i of arg) {<i>${i}</i>}}';

      let invoke = new Function('arg', 'return ' + nebbia(template));

      assert.strictEqual(
        invoke([0, 1]),
        '<i>0</i><i>1</i>'
      );
    });

    it(`The method should perform an operator translation of 'while'`, () => {
      let template =
      '${while (arg-- > 0) {<i>${arg}</i>}}';

      let invoke = new Function('arg', 'return ' + nebbia(template));

      assert.strictEqual(
        invoke(2),
        '<i>1</i><i>0</i>'
      );
    });
  });

  describe(`JavaScript syntax test group`, () => {
    it(`The first argument to the method is a string type`, () => {
      assert.throws(() => {
        nebbia();
      });
    });

    it(`The parser must handle expressions`, () => {
      let template =
      '${if (arg.toString()) {<i>${arg}</i>}}';

      let invoke = new Function('arg', 'return ' + nebbia(template));

      assert.strictEqual(
        invoke(1),
        '<i>1</i>'
      );
    });

    it(`The parser must handle Array destructuring`, () => {
      let template =
      '${for (let [i] of arg) {<i>${i}</i>}}';

      let invoke = new Function('arg', 'return ' + nebbia(template));

      assert.strictEqual(
        invoke([
          [0],
          [1]
        ]),
        '<i>0</i><i>1</i>'
      );
    });

    it(`The parser must handle Object destructuring`, () => {
      let template =
      '${for (let {i} of arg) {<i>${i}</i>}}';

      let invoke = new Function('arg', 'return ' + nebbia(template));

      assert.strictEqual(
        invoke([
          {i: 0},
          {i: 1}
        ]),
        '<i>0</i><i>1</i>'
      );
    });

    it(`The parser must handle destructuring assignment Object`, () => {
      let template =
      '${for (let {i = 0} of arg) {<i>${i}</i>}}';

      let invoke = new Function('arg', 'return ' + nebbia(template));

      assert.strictEqual(
        invoke([
          {m: 0},
          {i: 1}
        ]),
        '<i>0</i><i>1</i>'
      );
    });

    it(`Throw an exception if the condition is empty`, () => {
      assert.throws(() => {
        nebbia('${for () {<i></i>}}');
      });
    });

    it(`Throw an exception if the expression does follow the statement`, () => {
      assert.throws(() => {
        nebbia('${for (true) {}}');
      });
    });
  });

  describe(`Nested expressions`, () => {
    it(`The statements 'for' is in a statements 'if'`, () => {
      let template =
      '${if (arg) {<p>${for (let i of arg) {<i>${i}</i>}}</p>}}';

      let invoke = new Function('arg', 'return ' + nebbia(template));

      assert.strictEqual(
        invoke([0, 1]),
        '<p><i>0</i><i>1</i></p>'
      );
    });

    it(`The statements 'if' is in a statements 'while'`, () => {
      let template =
      '${while (arg.pop() > -1) {<p>${if (arg.length > 0) {<i>${arg.length}</i>}}</p>}}';

      let invoke = new Function('arg', 'return ' + nebbia(template));

      assert.strictEqual(
        invoke([0, 1]),
        '<p><i>1</i></p><p></p>'
      );
    });
  });

  describe(`Multiple statements`, () => {
    it(`The operator translation of 'if' with other expression`, () => {
      let template =
      '${if (arg === true) {<i>1</i>} hello}';

      let invoke = new Function('arg', 'hello', 'return ' + nebbia(template));

      assert.strictEqual(
        invoke(true, 'Hello, World!'),
        '<i>1</i>Hello, World!'
      );
    });

    it(`The operator translation of 'if...else' with other expression`, () => {
      let template =
      '${hello if (arg === true) {<i>1</i>} else {<i>0</i>}}';

      let invoke = new Function('arg', 'hello', 'return ' + nebbia(template));

      assert.strictEqual(
        invoke(false, 'Hello, World!'),
        'Hello, World!<i>0</i>'
      );
    });

    it(`The operator translation of 'for' with other expression`, () => {
      let template =
      '${hello for (let i = 0; i < 1; i++) {<i>${i}</i>}}';

      let invoke = new Function('hello', 'return ' + nebbia(template));

      assert.strictEqual(
        invoke('Hello, World!'),
        'Hello, World!<i>0</i>'
      );
    });

    it(`The operator translation of 'for...in' with other expression`, () => {
      let template =
      '${hello for (let i in arg) {<i>${i}</i>}}';

      let invoke = new Function('arg', 'hello', 'return ' + nebbia(template));

      assert.strictEqual(
        invoke({foo: 1, bar: 2}, 'Hello, World!'),
        'Hello, World!<i>foo</i><i>bar</i>'
      );
    });

    it(`The operator translation of 'for...of' with other expression`, () => {
      let template =
      '${hello for (let i of arg) {<i>${i}</i>}}';

      let invoke = new Function('arg', 'hello', 'return ' + nebbia(template));

      assert.strictEqual(
        invoke([1], 'Hello, World!'),
        'Hello, World!<i>1</i>'
      );
    });

    it(`The operator translation of 'while' with other expression`, () => {
      let template =
      '${hello while (arg.pop() > 0) {<i>${arg.length}</i>}}';

      let invoke = new Function('arg', 'hello', 'return ' + nebbia(template));

      assert.strictEqual(
        invoke([0, 1, 2], 'Hello, World!'),
        'Hello, World!<i>2</i><i>1</i>'
      );
    });
  });

  describe(`Exceptional parser behavior`, () => {
    it(`String is a required argument`, () => {
      assert.throws(() => {
        nebbia();
      });
    });

    it(`Do not throw an exception when the expression is empty`, () => {
      let invoke = new Function('return ' + nebbia('<i>${}</i>'));

      assert.strictEqual(invoke(), '<i></i>');
    });

    it(`The parser must skip the '$' character without the bracket '{'`, () => {
      let template =
      '<i>$</i>';

      let invoke = new Function('arg', 'return ' + nebbia(template));
      assert.strictEqual(invoke(), template);

      let template1 =
      '<i>$$</i>';

      let invoke1 = new Function('arg', 'return ' + nebbia(template1));
      assert.strictEqual(invoke1(), template1);

      let template2 =
      '<i>$${arg}</i>';

      let invoke2 = new Function('arg', 'return ' + nebbia(template2));
      assert.strictEqual(invoke2(''), template);

      let template3 =
      '<i>${arg}$</i>';

      let invoke3 = new Function('arg', 'return ' + nebbia(template3));
      assert.strictEqual(invoke3(''), template);
    });

    it(`The parser must skip the space character inside an expression`, () => {
      let template =
      '${ if (arg > 0) {<i>${ arg }</i>} }';

      let invoke = new Function('arg', 'return ' + nebbia(template));

      assert.strictEqual(
        invoke(1),
        '<i>1</i>'
      );

      let template1 =
      '${if (arg > 0) {<i>${arg }</i>} }';

      let invoke1 = new Function('arg', 'return ' + nebbia(template1));

      assert.strictEqual(
        invoke1(1),
        '<i>1</i>'
      );

      let template2 =
      '${ if (arg > 0) {<i>${ arg }</i>}}';

      let invoke2 = new Function('arg', 'return ' + nebbia(template2));

      assert.strictEqual(
        invoke2(1),
        '<i>1</i>'
      );
    });

    it(`The parser must skip lines enclosed '\`' in a inside an expression`, () => {
      let template =
      '${if (arg === `")"`) {<i>bracket</i>}}';

      let invoke = new Function('arg', 'return ' + nebbia(template));

      assert.strictEqual(
        invoke(`)`),
        '<i>bracket</i>'
      );
    });
  });
});
