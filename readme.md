# Nebbia

[![npm version](https://img.shields.io/npm/v/nebbia.svg)](https://www.npmjs.com/package/nebbia)
[![node](https://img.shields.io/node/v/nebbia.svg)](https://www.npmjs.com/package/nebbia)
[![types](https://img.shields.io/npm/types/nebbia.svg)](https://www.npmjs.com/package/nebbia)
[![license](https://img.shields.io/npm/l/nebbia.svg)](LICENSE)

`Nebbia` is a JavaScript [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) (Template strings) compiler. It makes templates more expressive.

To improve reliability and maintainability the codebase has been migrated to [TypeScript](https://www.typescriptlang.org).

### How it works?

![yuml diagram](http://yuml.me/woodger/diagram/scruffy;dir:LR/class/[Template{bg:snow}]->parse[Syntax_Tree],[Syntax_Tree]->compile[Template_String{bg:yellowgreen}],[Template_String]-.->[new_Function{bg:yellow}])

Template literals are enclosed by the back-tick `` ` `` character instead of double or single quotes. Template literals can contain placeholders. These are indicated by the dollar sign and curly braces `` `${expression}` ``. The expressions in the placeholders and the text between them get passed to a function. The default function just concatenates the parts into a single string.

Template literals are useful, but placeholders can only contain expressions. The following example demonstrates the problem of string interpolation.

```js
`${1 + 1}` // '2'
`${}` // SyntaxError: Unexpected token }
`${if (true) {}}` // SyntaxError: Unexpected token if
```

`Nebbia` was created to help solve this problem. The compiler extends the capabilities of [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) (Template strings) with the capabilities of standard `JavaScript` [statements and declarations](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements).

List of supported statements:

- [if](#if)
- [if...else](#ifelse)
- [if...else if](#ifelse-if)
- [for](#for)
- [for...in](#forin)
- [for...of](#forof)
- [while](#while)
- [do...while](#dowhile)
- [break](#break)
- [continue](#continue)

> NOTE The `break` and `continue` statements are supported only inside iteration blocks: `for`, `for...in`, `for...of`, `while`, and `do...while`.

`Nebbia` was created to make template strings more forgiving. An empty expression `${}` will not `throw` an exception. It supports *closures* and multiple *nesting* of expressions.
The compiled pattern does not use regular expressions.

## Getting Started

### Installation

To use `Nebbia` in your project, run:

```bash
npm i nebbia
```
`Nebbia` is a [Node.js®](https://nodejs.org/) module with bundled TypeScript declarations. It is built for Node.js `>=20.19.0` and targets ECMAScript 2023.

## API docs

### Table of Contents

[nebbia(template)](#nebbiatemplate)
- [class Node](#class-node)
  - [static: Node.unity](#static-nodeunity)
  - [constructors](#constructors)
  - [node.append(child)](#nodeappendchild)
  - [node.build()](#nodebuild)
  - [node.children](#nodechildren)
  - [node.name](#nodename)
  - [node.parent](#nodeparent)
  - [node.type](#nodetype)
  - [node.value](#nodevalue)
- [class Expression](#class-expression)
- [class Statement](#class-statement)
- [class Text](#class-text)
- [nebbia.parse(template)](#nebbiaparsetemplate)

#### nebbia(template)

- `template` <[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)> The template source to compile. By default, `'__string__'` is the name of the internal variable used to concatenate strings. You can change this marker by assigning a value to `nebbia.Node.unity`.
- returns: <[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)> Represents the `compiled` template strings of a node and its descendants. [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) are **enclosed** by the back-tick `` ` `` (grave accent).

**template.html**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Nebbia</title>
  </head>
  <body>
    <h1>${h1}</h1>
    ${if (list instanceof Array) {
      <header></header>
      ${for (let i of list) {
        <div>${i}</div>
      }}
    }
    if (footer) {
      <footer></footer>
    }}
  </body>
</html>
```

**template.txt**

```txt
${if (user === 'admin') {
  📆 To-do list
  for (let i of list) {
    - ${i.date} ${i.note}
  }
}
else {
  Offer a cup of coffee!
}}
```

A JavaScript template literal inside a statement is processed by the parser as is.

```html
${if (arg === `;)`) {
  <p>Maybe it's a smile</p>
}}
```

This is useful when you need to escape arguments in a statement. Otherwise, the parser will read the statement like `arg === ;`.

#### Statements by category

`Nebbia` uses JavaScript-like statement syntax to compile template strings. Several instructions can be in the same expression. Spaces and tabs are not taken into account by the parser.

##### if

```js
import nebbia from 'nebbia';

const template = '${if (arg === true) {<p>${arg}</p>}}';
const invoke = new Function('arg', 'return ' + nebbia(template));

invoke(true); // <p>true</p>
```

##### if...else

```js
import nebbia from 'nebbia';

const template = '${if (arg === true) {<p>${arg}</p>} else {<p>else</p>}}';
const invoke = new Function('arg', 'return ' + nebbia(template));

invoke(false); // <p>else</p>
```

##### if...else if

```js
import nebbia from 'nebbia';

const template = '${if (arg === 1) {<p>one</p>} else if (arg === 2) {<p>two</p>} else {<p>else</p>}}';
const invoke = new Function('arg', 'return ' + nebbia(template));

invoke(2); // <p>two</p>
```

##### for

```js
import nebbia from 'nebbia';

const template = '${for (let i = 0; i < count; i++) {<p>${i}</p>}}';
const invoke = new Function('count', 'return ' + nebbia(template));

invoke(2); // <p>0</p><p>1</p>
```

##### for...in

```js
import nebbia from 'nebbia';

const template = '${for (let i in obj) {<p>${i}</p>}}';
const invoke = new Function('obj', 'return ' + nebbia(template));

invoke({
  fruit: 'apple',
  cart: 1
}); // <p>fruit</p><p>cart</p>
```

##### for...of

```js
import nebbia from 'nebbia';

const template = '${for (let i of list) {<p>${i}</p>}}';
const invoke = new Function('list', 'return ' + nebbia(template));

invoke([ 0, 1 ]); // <p>0</p><p>1</p>
```

##### while

```js
import nebbia from 'nebbia';

const template = '${while (list.length > 0) {<p>${list.pop()}</p>}}';
const invoke = new Function('list', 'return ' + nebbia(template));

invoke([ 0, 1 ]); // <p>1</p><p>0</p>
```

##### do...while

```js
import nebbia from 'nebbia';

const template = '${do {<p>${arg}</p>} while (arg-- > 0)}';
const invoke = new Function('arg', 'return ' + nebbia(template));

invoke(1); // <p>1</p><p>0</p>
```

##### break

```js
import nebbia from 'nebbia';

const template = '${for (let i = 0; i < list.length; i++) {${if (list[i] === stop) {${break}}}<p>${list[i]}</p>}}';
const invoke = new Function('list', 'stop', 'return ' + nebbia(template));

invoke([ 1, 2, 3 ], 3); // <p>1</p><p>2</p>
```

##### continue

```js
import nebbia from 'nebbia';

const template = '${for (let i = 0; i < list.length; i++) {${if (list[i] === skip) {${continue}}}<p>${list[i]}</p>}}';
const invoke = new Function('list', 'skip', 'return ' + nebbia(template));

invoke([ 1, 2, 3 ], 2); // <p>1</p><p>3</p>
```

#### class Node

`Node` is the base AST class used by the compiler tree. Concrete node classes inherit its tree fields and methods.

![yuml diagram](http://yuml.me/woodger/diagram/scruffy;dir:LR/class/[Node]->extends[Expression{bg:snow}],[Node]->extends[Text{bg:snow}],[Node]->extends[Statement{bg:snow}])

The following classes inherit from `Node`’s methods and properties: [Expression](#class-expression), [Statement](#class-statement) and [Text](#class-text).

#### static: Node.unity

<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)> Returns the string concatenation keyword. Public export: `nebbia.Node.unity`. **Default:** `'__string__'`.

#### constructors

The base `Node` class is abstract in TypeScript. Use concrete node classes: [Expression](#class-expression), [Statement](#class-statement), and [Text](#class-text). They initialize default node instance values inherited from `Node`.

#### node.append(child)

- `child` <[Node](#class-node)> The `node` to append to the given parent node.
- returns: <[undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)>

Adds the specified `node` argument as the last child to the current node.

#### node.build()

- returns: <[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)> Represents the `compiled` template strings of a node and its descendants. [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) are **enclosed** by the back-tick `` ` `` (grave accent).

#### node.children

- <[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)> Contains all the children of this `node`.

#### node.name

- <[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)|[null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null)> Contains the name of the `node`.
The structure of the name will differ with the `node` type. E.g. A [Statement](#class-statement) will contain the name of the corresponding statement, a [Text](#class-text) node will have the `#text` string. **Default:** `null`.

#### node.parent

- <[Node](#class-node)|[null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null)> Returns a `node` that is the parent of this `node`. If there is no such `node`, for example when this node is the top of the tree or does not participate in a tree, this property returns `null`.

#### node.type

<[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)|[null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null)> Returns an unsigned short representing the type of the node. **Default:** `null`.

Possible values are:

| Name                            | Value |
|---------------------------------|:-----:|
| [Expression](#class-expression) | 0     |
| [Text](#class-text)             | 1     |
| [Statement](#class-statement)   | 2     |

#### node.value

<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)> Returns the value of the current `node`.

#### class Expression

Represents a group of nodes resulting from parsing an expression into [Statement](#class-statement) and [Text](#class-text) nodes.

![yuml diagram](http://yuml.me/diagram/scruffy;dir:LR/class/[Expression]-[Text],[Expression]-[Statement])

#### class Text

Represents the textual content.

#### class Statement

Contains the `name` of the statement. The condition is stored in the `value` of the `node`.

#### nebbia.parse(template)

- `template` <[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)> The template source to parse. By default, `'__string__'` is the name of the internal variable used to concatenate strings. You can change this marker by assigning a value to `nebbia.Node.unity`.
- returns: <[Expression](#class-expression)> Returns the root expression node. The returned AST gives programmatic access to the template string structure.

An example of parsing the template:

**template.html**

```js
<div>
${if (typeof value === 'string') {
  <p>${value}</p>
}}
</div>
```

**index.js**

```js
import fs from 'fs';
import nebbia from 'nebbia';

const content = fs.readFileSync('./template.html');
const ast = nebbia.parse(content);
const template = ast.build();
```

*const ast:*

<img alt="yuml diagram" src="http://yuml.me/diagram/scruffy;dir:LR/class/[root: Expression]-[if (typeof value === 'string'): Statement],[root: Expression]-[</div>: Text],[if (typeof value === 'string'): Statement]<>->true[Expression],[Expression]-[<p>: Text],[Expression]-[value: Expression],[root: Expression]-[<div>: Text],[Expression]-[</p>: Text]">

*const template:*

```js
`<div>
${((__string__)=>{if(typeof value === 'string')__string__+=`
  <p>${value}</p>
`;return __string__})(``)}
</div>
`
```

## Development

Planned:
- Measure benchmark.
