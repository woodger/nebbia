# Nebbia

[![License](https://img.shields.io/npm/l/express.svg)](https://github.com/woodger/nebbia/blob/master/LICENSE)
[![Build Status](https://travis-ci.com/woodger/nebbia.svg?branch=master)](https://travis-ci.com/woodger/nebbia)
[![Coverage Status](https://coveralls.io/repos/github/woodger/nebbia/badge.svg?branch=master)](https://coveralls.io/github/woodger/nebbia?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/woodger/nebbia/badge.svg?targetFile=package.json)](https://snyk.io/test/github/woodger/nebbia?targetFile=package.json)

`Nebbia` is a JavaScript [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) (Template strings) compiler. Make the templates more expressive.

To improve reliability and maintainability the code is migrated to [TypeScript](https://www.typescriptlang.org).

### How it works?

![yuml diagram](http://yuml.me/woodger/diagram/scruffy;dir:LR/class/[Template{bg:snow}]->parse[Syntax_Tree],[Syntax_Tree]->compile[Template_String{bg:yellowgreen}],[Template_String]-.->[new_Function{bg:yellow}])

Template literals are enclosed by the back-tick `` ` `` character instead of double or single quotes. Template literals can contain placeholders. These are indicated by the dollar sign and curly braces `` `${expression}` ``. The expressions in the placeholders and the text between them get passed to a function. The default function just concatenates the parts into a single string.

This is a very useful feature. The expression can only be used to interpolate strings. The following example demonstrates the problem of string interpolation.

```js
`${1 + 1}` // '2'
`${}` // SyntaxError: Unexpected token }
`${if (true) {}}` // SyntaxError: Unexpected token if
```

`Nebbia` was created to help solve this problem. The compiler extends the capabilities of [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) (Template strings) with the capabilities of standard `JavaScript` [statements and declarations](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements).

List of supported statements:

- [if](#if)
- [if...else](#ifelse)
- [for](#for)
- [for...in](#forin)
- [for...of](#forof)
- [while](#while)

> NOTE The `break` statement is a prisoner in blocks `for`, `for..in`, `for ...of`, `while` does not support interrupt inside iterations.

`Nebbia` created by to make template strings more loyal. An empty expression `${}` will not `throw` an exception. Supports *closures* and multiple *nesting* of expressions.
The compiled pattern does not use regular expressions.

## Getting Started

### Installation

To use `Nebbia` in your project, run:

```bash
npm i nebbia
```
Browser-compatible [Node.js®](https://nodejs.org/) module, implemented by following the [ECMAScript® 2018 Language Specification
](https://www.ecma-international.org/ecma-262/9.0/index.html) standard.

## API docs

### Table of Contents

[nebbia(template)](#nebbiatemplate)
- [class Node](#class-node)
  - [static: Node.unity](#static-nodeunity)
  - [constructor: new Node()](#constructor-new-node)
  - [node.append(child)](#nodeappendchild)
  - [node.build()](#nodebuild)
  - [node.childs](#nodechilds)
  - [node.name](#nodename)
  - [node.parent](#nodeparent)
  - [node.type](#nodetype)
  - [node.value](#nodevalue)
- [class Expression](#class-expression)
- [class Statement](#class-statement)
- [class Text](#class-text)
- [nebbia.parse(template)](#nebbiaparsetemplate)

#### nebbia(template)

- `template` <[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)> The template inside the ad must be in the block `{}`. By default, `'__string__'` is the name of a variable used to concatenate strings. You can change a keyword by assigning a value to the `nebbia.unity` property.
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

Strings are enclosed by the back-tick `` ` `` character is processed by the parser as is.

```html
${if (arg === `;)`) {
  <p>Maybe it's a smile</p>
}}
```

This is useful when you need to escape arguments in a statement. Otherwise, the parser will read the statement like `arg === ;`.

#### Statements by category

The `Nebbia` uses JavaScript with an appropriate syntax to create a compilation of template strings. Several instructions can be in the same expression. The spaces and tabs is not taken into account by the parser.

##### if

```js
const nebbia = require('nebbia');

const template = '${if (arg === true) {<p>${arg}</p>}}';
const example = new Function('arg', 'return ' + nebbia(template));

example(true); // <p>true</p>
```

##### if...else

```js
const nebbia = require('nebbia');

const template = '${if (arg === true) {<p>${arg}</p>} else {<p>else</p>}}';
const example = new Function('arg', 'return ' + nebbia(template));

example(false); // <p>else</p>
```

> NOTE Multiple `if...else` statements not support be nested to create an `else if` clause.
> Planned to be implemented in the future.

##### for

```js
const nebbia = require('nebbia');

const template = '${for (let i = 0; i < count; i++) {<p>${i}</p>}}';
const example = new Function('count', 'return ' + nebbia(template));

example(2); // <p>0</p><p>1</p>
```

##### for...in

```js
const nebbia = require('nebbia');

const template = '${for (let i in obj) {<p>${i}</p>}}';
const example = new Function('obj', 'return ' + nebbia(template));

example({
  fruit: 'apple',
  cart: 1
}); // <p>fruit</p><p>cart</p>
```

##### for...of

```js
const nebbia = require('nebbia');

const template = '${for (let i of list) {<p>${i}</p>}}';
const example = new Function('list', 'return ' + nebbia(template));

example([0, 1]); // <p>0</p><p>1</p>
```

##### while

```js
const nebbia = require('nebbia');

const template = '${while (list.pop() > -1) {<p>${i.length}</p>}}';
const example = new Function('list', 'return ' + nebbia(template));

example([0, 1]); // <p>1</p><p>0/p>
```

> NOTE The `do...while` statement not implemented.
> Planned to be implemented in the future.

#### class Node

`Node` is an interface from which a number of `Tree` object types inherit. It allows those types to be treated similarly; for example, inheriting the same set of methods, or being tested in the same way.

![yuml diagram](http://yuml.me/woodger/diagram/scruffy;dir:LR/class/[Node]->extends[Expression{bg:snow}],[Node]->extends[Text{bg:snow}],[Node]->extends[Statement{bg:snow}])

The following interfaces all inherit from `Node`’s methods and properties: [Expression](#class-expression), [Statement](#class-statement) and [Text](#class-text).

#### static: Node.unity

<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)> Returns the string concatenation keyword. **Default:** `'__string__'`.

#### constructor: new Node()

Sets default node instance values.

#### node.append(child)

- `child` <[Node](#class-node)> The `node` to append to the given parent node.
- returns: <[undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)>

Adds the specified `node` argument as the last child to the current node.

#### node.build()

- returns: <[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)> Represents the `compiled` template strings of a node and its descendants. [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) are **enclosed** by the back-tick `` ` `` (grave accent).

#### node.childs

- <[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)> Contains all the children of this `node`.

#### node.name

- <[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)|[null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null)> Contains the name of the `node`.
The structure of the name will differ with the `node` type. E.g. An [Statement](#class-statement) will contain the name of the corresponding statement, a [Text](#class-text) node will have the `#text` string. **Default:** `null`.

#### node.parent

- <[Node](#class-node)|[null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null)> Returns a `node` that is the parent of this `node`. If there is no such `node`, like if this node is the top of the tree or if doesn't participate in a tree, this property returns `null`.

#### node.type

<[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)|[null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null)> Returns an unsigned short representing the type of the node. **Default:** `null`.

Possible values are:

| Name                            | Value |
|---------------------------------|:-----:|
| [Expression](#class-expression) | 0     |
| [Text](#class-text)             | 1     |
| [Statement](#class-statement)   | 2     |

#### node.value

<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)> Returns value of the current `node`.

#### class Expression

Represents a group of nodes resulting from parsing an expression on [Statement](#class-statement) and [Text](#class-text).

![yuml diagram](http://yuml.me/diagram/scruffy;dir:LR/class/[Expression]-[Text],[Expression]-[Statement])

#### class Text

Represents the textual content.

#### class Statement

Contains the `name` of the statement, the condition is stored in the `value` of the `node`.

#### nebbia.parse(template)

- `template` <[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)> The template inside the ad must be in the block `{}`. By default, `'__string__'` is the name of a variable used to concatenate strings. You can change a keyword by assigning a value to the `nebbia.unity` property.
- returns: <[Expression](#class-expression)> Each branch of the tree ends in a `node`, and each `node` contains objects. Methods provides programmatic access to the tree; with them you can change the template strings structure.

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
const nebbia = require('nebbia');
const fs = require('fs');

const content = fs.readFileSync('./template.html');
const tree = nebbia.parse(content);
const template = tree.build();
```

*const tree:*

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

Planed:
- Measure benchmark.
- To introduce:
  - `do...while`, `else...if` statement.
  - `break`, `continue` statement is a prisoner in blocks `for` and `while` inside iterations.
