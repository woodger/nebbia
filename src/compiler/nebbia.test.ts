import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import nebbia from './nebbia';

type TemplateFunction = (...values: unknown[]) => string;

function compileTemplate(template: string, ...params: string[]): TemplateFunction {
  const literal = nebbia(template);

  return new Function(...params, `return ${literal}`) as TemplateFunction;
}

function assertThrowsError(fn: () => void, message: string): void {
  try {
    fn();
  }
  catch (error) {
    if (!(error instanceof Error)) {
      assert.fail(`Expected Error, got ${String(error)}`);
    }

    assert.strictEqual(error.constructor, Error);
    assert.strictEqual(error.message, message);
    return;
  }

  assert.fail('Expected function to throw an Error');
}

describe('#nebbia()', () => {
  describe('JavaScript statements', () => {
    test('translates if statements', () => {
      const invoke = compileTemplate(
        '${if (arg) {<i>${arg}</i>}}',
        'arg'
      );

      assert.strictEqual(invoke(), '');
      assert.strictEqual(invoke(1), '<i>1</i>');
    });

    test('translates if...else statements', () => {
      const invoke = compileTemplate(
        '${if (arg) {<i>${arg}</i>} else {<i>default</i>}}',
        'arg'
      );

      assert.strictEqual(invoke(1), '<i>1</i>');
      assert.strictEqual(invoke(), '<i>default</i>');
    });

    test('translates if...else if statements', () => {
      const invoke = compileTemplate(
        '${if (arg === 1) {<i>one</i>} else if (arg === 2) {<i>two</i>}}',
        'arg'
      );

      assert.strictEqual(invoke(1), '<i>one</i>');
      assert.strictEqual(invoke(2), '<i>two</i>');
      assert.strictEqual(invoke(3), '');
    });

    test('translates if...else if...else statements', () => {
      const invoke = compileTemplate(
        '${if (arg === 1) {<i>one</i>} else if (arg === 2) ' +
        '{<i>two</i>} else {<i>default</i>}}',
        'arg'
      );

      assert.strictEqual(invoke(1), '<i>one</i>');
      assert.strictEqual(invoke(2), '<i>two</i>');
      assert.strictEqual(invoke(3), '<i>default</i>');
    });

    test('translates chained if...else if statements', () => {
      const invoke = compileTemplate(
        '${if (arg === 1) {<i>one</i>} else if (arg === 2) ' +
        '{<i>two</i>} else if (arg === 3) {<i>three</i>}}',
        'arg'
      );

      assert.strictEqual(invoke(1), '<i>one</i>');
      assert.strictEqual(invoke(2), '<i>two</i>');
      assert.strictEqual(invoke(3), '<i>three</i>');
      assert.strictEqual(invoke(4), '');
    });

    test('translates for statements', () => {
      const invoke = compileTemplate(
        '${for (let i = 0; i < arg; i++) {<i>${i}</i>}}',
        'arg'
      );

      assert.strictEqual(invoke(2), '<i>0</i><i>1</i>');
    });

    test('translates for...in statements', () => {
      const invoke = compileTemplate(
        '${for (let i in arg) {<i>${i}</i>}}',
        'arg'
      );

      assert.strictEqual(
        invoke({
          foo: 1,
          bar: 2
        }),
        '<i>foo</i><i>bar</i>'
      );
    });

    test('translates for...of statements', () => {
      const invoke = compileTemplate(
        '${for (let i of arg) {<i>${i}</i>}}',
        'arg'
      );

      assert.strictEqual(invoke([ 0, 1 ]), '<i>0</i><i>1</i>');
    });

    test('translates while statements', () => {
      const invoke = compileTemplate(
        '${while (arg-- > 0) {<i>${arg}</i>}}',
        'arg'
      );

      assert.strictEqual(invoke(2), '<i>1</i><i>0</i>');
    });

    test('translates do...while statements', () => {
      const invoke = compileTemplate(
        '${do {<i>${arg}</i>} while (arg-- > 0)}',
        'arg'
      );

      assert.strictEqual(invoke(2), '<i>2</i><i>1</i><i>0</i>');
      assert.strictEqual(invoke(0), '<i>0</i>');
    });

    test('translates do...while statements with optional semicolon', () => {
      const invoke = compileTemplate(
        '${do {<i>${arg}</i>} while (arg-- > 0);}',
        'arg'
      );

      assert.strictEqual(invoke(1), '<i>1</i><i>0</i>');
    });

    test('translates break statements inside for statements', () => {
      const invoke = compileTemplate(
        '${for (let i = 0; i < arg; i++) {' +
        '${if (i === 2) {${break}}}<i>${i}</i>}}',
        'arg'
      );

      assert.strictEqual(invoke(4), '<i>0</i><i>1</i>');
    });

    test('translates continue statements inside for statements', () => {
      const invoke = compileTemplate(
        '${for (let i = 0; i < arg; i++) {' +
        '${if (i % 2 === 0) {${continue;}}}<i>${i}</i>}}',
        'arg'
      );

      assert.strictEqual(invoke(5), '<i>1</i><i>3</i>');
    });

    test('translates break statements inside while statements', () => {
      const invoke = compileTemplate(
        '${while (arg.length > 0) {' +
        '${if (arg[0] === 0) {${break}}}<i>${arg.shift()}</i>}}',
        'arg'
      );

      assert.strictEqual(invoke([ 2, 1, 0, 3 ]), '<i>2</i><i>1</i>');
    });

    test('translates continue statements inside while statements', () => {
      const invoke = compileTemplate(
        '${while ((value = arg.shift()) !== undefined) {' +
        '${if (value === 0) {${continue}}}<i>${value}</i>}}',
        'arg',
        'value'
      );

      assert.strictEqual(invoke([ 1, 0, 2 ]), '<i>1</i><i>2</i>');
    });
  });

  describe('JavaScript syntax', () => {
    test('handles expressions', () => {
      const invoke = compileTemplate(
        '${if (arg.toString()) {<i>${arg}</i>}}',
        'arg'
      );

      assert.strictEqual(invoke(1), '<i>1</i>');
    });

    test('handles template literal expressions', () => {
      const invoke = compileTemplate(
        '<i>${`value:${arg}`}</i>',
        'arg'
      );

      assert.strictEqual(invoke(1), '<i>value:1</i>');
    });

    test('ignores closing parentheses inside quoted statement conditions', () => {
      const doubleQuoted = compileTemplate(
        '${if (arg === ")") {<i>double</i>}}',
        'arg'
      );
      const singleQuoted = compileTemplate(
        '${if (arg === \')\') {<i>single</i>}}',
        'arg'
      );

      assert.strictEqual(doubleQuoted(')'), '<i>double</i>');
      assert.strictEqual(doubleQuoted('('), '');
      assert.strictEqual(singleQuoted(')'), '<i>single</i>');
      assert.strictEqual(singleQuoted('('), '');
    });

    test('ignores closing braces inside quoted statement conditions', () => {
      const doubleQuoted = compileTemplate(
        '${if (arg === "}") {<i>double</i>}}',
        'arg'
      );
      const singleQuoted = compileTemplate(
        '${if (arg === \'}\') {<i>single</i>}}',
        'arg'
      );

      assert.strictEqual(doubleQuoted('}'), '<i>double</i>');
      assert.strictEqual(doubleQuoted('{'), '');
      assert.strictEqual(singleQuoted('}'), '<i>single</i>');
      assert.strictEqual(singleQuoted('{'), '');
    });

    test('ignores closing braces inside quoted nested expressions', () => {
      const invoke = compileTemplate(
        '${if (arg) {<i>${arg === "}" ? "brace" : ""}</i>}}',
        'arg'
      );

      assert.strictEqual(invoke('}'), '<i>brace</i>');
      assert.strictEqual(invoke('{'), '<i></i>');
    });

    test('handles array destructuring', () => {
      const invoke = compileTemplate(
        '${for (let [i] of arg) {<i>${i}</i>}}',
        'arg'
      );

      assert.strictEqual(
        invoke([
          [ 0 ],
          [ 1 ]
        ]),
        '<i>0</i><i>1</i>'
      );
    });

    test('handles object destructuring', () => {
      const invoke = compileTemplate(
        '${for (let {i} of arg) {<i>${i}</i>}}',
        'arg'
      );

      assert.strictEqual(
        invoke([
          { i: 0 },
          { i: 1 }
        ]),
        '<i>0</i><i>1</i>'
      );
    });

    test('handles object destructuring defaults', () => {
      const invoke = compileTemplate(
        '${for (let {i = 0} of arg) {<i>${i}</i>}}',
        'arg'
      );

      assert.strictEqual(
        invoke([
          { m: 0 },
          { i: 1 }
        ]),
        '<i>0</i><i>1</i>'
      );
    });

    test('throws when statement condition is empty', () => {
      assertThrowsError(
        () => nebbia('${for () {<i></i>}}'),
        'Statement "for" must include content between parentheses'
      );
    });

    test('throws when statement body is empty', () => {
      assertThrowsError(
        () => nebbia('${for (true) {}}'),
        'Statement "for" must include template content inside braces'
      );
    });

    test('throws when do statement body is empty', () => {
      assertThrowsError(
        () => nebbia('${do {} while (true)}'),
        'Statement "do" must include template content inside braces'
      );
    });

    test('throws when do statement has no while condition', () => {
      assertThrowsError(
        () => nebbia('${do {<i></i>}}'),
        'Statement "do" must include while condition'
      );
    });

    test('throws when break statement is outside an iteration statement', () => {
      assertThrowsError(
        () => nebbia('${break}'),
        'Statement "break" must be used inside iteration statements'
      );
    });

    test('throws when continue statement is outside an iteration statement', () => {
      assertThrowsError(
        () => nebbia('${if (true) {${continue}}}'),
        'Statement "continue" must be used inside iteration statements'
      );
    });
  });

  describe('Nested expressions', () => {
    test('renders a for statement inside an if statement', () => {
      const invoke = compileTemplate(
        '${if (arg) {<p>${for (let i of arg) {<i>${i}</i>}}</p>}}',
        'arg'
      );

      assert.strictEqual(invoke([ 0, 1 ]), '<p><i>0</i><i>1</i></p>');
    });

    test('renders an if statement inside a while statement', () => {
      const invoke = compileTemplate(
        '${while (arg.pop() > -1) {<p>${if (arg.length > 0) ' +
        '{<i>${arg.length}</i>}}</p>}}',
        'arg'
      );

      assert.strictEqual(invoke([ 0, 1 ]), '<p><i>1</i></p><p></p>');
    });

    test('renders an expression inside a do...while statement', () => {
      const invoke = compileTemplate(
        '${do {<i>${arg.pop()}</i>} while (arg.length > 0)}',
        'arg'
      );

      assert.strictEqual(invoke([ 0, 1 ]), '<i>1</i><i>0</i>');
    });

    test('keeps break statements inside the nearest nested loop', () => {
      const invoke = compileTemplate(
        '${for (let row of arg) {<p>${for (let value of row) {' +
        '${if (value === 0) {${break}}}<i>${value}</i>}}</p>}}',
        'arg'
      );

      assert.strictEqual(
        invoke([
          [ 1, 0, 2 ],
          [ 3, 4 ]
        ]),
        '<p><i>1</i></p><p><i>3</i><i>4</i></p>'
      );
    });
  });

  describe('Multiple statements', () => {
    test('renders if statements with following expressions', () => {
      const invoke = compileTemplate(
        '${if (arg === true) {<i>1</i>} hello}',
        'arg',
        'hello'
      );

      assert.strictEqual(invoke(true, 'Hello, World!'), '<i>1</i>Hello, World!');
    });

    test('renders if...else statements with preceding expressions', () => {
      const invoke = compileTemplate(
        '${hello if (arg === true) {<i>1</i>} else {<i>0</i>}}',
        'arg',
        'hello'
      );

      assert.strictEqual(invoke(false, 'Hello, World!'), 'Hello, World!<i>0</i>');
    });

    test('renders for statements with preceding expressions', () => {
      const invoke = compileTemplate(
        '${hello for (let i = 0; i < 1; i++) {<i>${i}</i>}}',
        'hello'
      );

      assert.strictEqual(invoke('Hello, World!'), 'Hello, World!<i>0</i>');
    });

    test('renders for...in statements with preceding expressions', () => {
      const invoke = compileTemplate(
        '${hello for (let i in arg) {<i>${i}</i>}}',
        'arg',
        'hello'
      );

      assert.strictEqual(
        invoke({
          foo: 1,
          bar: 2
        },
        'Hello, World!'),
        'Hello, World!<i>foo</i><i>bar</i>'
      );
    });

    test('renders for...of statements with preceding expressions', () => {
      const invoke = compileTemplate(
        '${hello for (let i of arg) {<i>${i}</i>}}',
        'arg',
        'hello'
      );

      assert.strictEqual(invoke([ 1 ], 'Hello, World!'), 'Hello, World!<i>1</i>');
    });

    test('renders while statements with preceding expressions', () => {
      const invoke = compileTemplate(
        '${hello while (arg.pop() > 0) {<i>${arg.length}</i>}}',
        'arg',
        'hello'
      );

      assert.strictEqual(invoke([ 0, 1, 2 ], 'Hello, World!'), 'Hello, World!<i>2</i><i>1</i>');
    });
  });

  describe('Exceptional parser behavior', () => {
    test('throws when an expression uses the reserved unity marker', () => {
      assertThrowsError(
        () => nebbia('<i>${' + nebbia.Node.unity + '}</i>'),
        `Reserved expression marker "${nebbia.Node.unity}" cannot be used in templates`
      );
    });

    test('renders empty expressions as empty text', () => {
      const invoke = compileTemplate('<i>${}</i>');

      assert.strictEqual(invoke(), '<i></i>');
    });

    test('preserves standalone dollar characters', () => {
      const invoke = compileTemplate('<i>$</i>', 'arg');

      assert.strictEqual(invoke(), '<i>$</i>');
    });

    test('preserves repeated standalone dollar characters', () => {
      const invoke = compileTemplate('<i>$$</i>', 'arg');

      assert.strictEqual(invoke(), '<i>$$</i>');
    });

    test('keeps a dollar before an expression as text', () => {
      const invoke = compileTemplate('<i>$${arg}</i>', 'arg');

      assert.strictEqual(invoke(''), '<i>$</i>');
    });

    test('keeps a dollar after an expression as text', () => {
      const invoke = compileTemplate('<i>${arg}$</i>', 'arg');

      assert.strictEqual(invoke(''), '<i>$</i>');
    });

    test('allows spaces around nested expressions', () => {
      const invoke = compileTemplate(
        '${ if (arg > 0) {<i>${ arg }</i>} }',
        'arg'
      );

      assert.strictEqual(invoke(1), '<i>1</i>');
    });

    test('allows spaces before a closing expression brace', () => {
      const invoke = compileTemplate(
        '${if (arg > 0) {<i>${arg }</i>} }',
        'arg'
      );

      assert.strictEqual(invoke(1), '<i>1</i>');
    });

    test('allows spaces after an opening expression brace', () => {
      const invoke = compileTemplate(
        '${ if (arg > 0) {<i>${ arg }</i>}}',
        'arg'
      );

      assert.strictEqual(invoke(1), '<i>1</i>');
    });

    test('parses statements without spaces before expressions', () => {
      const invoke = compileTemplate(
        '${for(let i in arg){<i>${i}</i>}}',
        'arg'
      );

      assert.strictEqual(
        invoke({
          foo: 1,
          bar: 2
        }),
        '<i>foo</i><i>bar</i>'
      );
    });

    test('ignores closing delimiters inside template strings', () => {
      const invoke = compileTemplate(
        '${if (arg === `")"`) {<i>bracket</i>}}',
        'arg'
      );

      assert.strictEqual(invoke(`")"`), '<i>bracket</i>');
      assert.strictEqual(invoke(`)`), '');
    });

    test('rejects template delimiters inside unsupported JavaScript fragments', () => {
      assert.throws(
        () => compileTemplate('${if (/}/.test(arg)) {<i>yes</i>}}', 'arg'),
        Error
      );
      assert.throws(
        () => compileTemplate('${if (arg /* ) */) {<i>yes</i>}}', 'arg'),
        Error
      );
    });

    test('preserves break and continue words as template text', () => {
      const invoke = compileTemplate(
        '${for (let i = 0; i < 1; i++) {break continue}}'
      );

      assert.strictEqual(invoke(), 'break continue');
    });
  });
});
