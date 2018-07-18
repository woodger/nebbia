/**
 * This module for Node.js® implemented by following the ECMAScript® 2018
 * Language Specification Standard.
 *
 * https://www.ecma-international.org/ecma-262/9.0/index.html
 */

const re = {
  bracket: /^\s*\(/,
  brace: /^\s*\{/,
  if: /^\s*\if\s*\(/
};

const keyword = '__string__';

class Node {
  constructor() {
    this.type = null;
    this.name = null;
    this.parent = null;
    this.childs = [];
    this.value = '';
  }

  append(child) {
    child.parent = this;
    this.childs.push(child);
  }

  build() {
    return this.value;
  }
}

class Expression extends Node {
  constructor() {
    super();

    this.type = 0;
    this.name = '#expression';
  }

  build() {
    if (this.value !== '') {
      return '${' + this.value + '}';
    }

    let value = '';

    for (let i of this.childs) {
      value += i.build();
    }

    return '`' + value + '`';
  }
}

class Text extends Node {
  constructor() {
    super();

    this.type = 1;
    this.name = '#text';
  }
}

class Statement extends Node {
  constructor() {
    super();

    this.type = 2;
    this.name = '';
  }

  build() {
    let value = '';
    let other = '';

    if (this.name === 'else') {
      return '';
    }

    for (let i of this.childs) {
      value += i.build();
    }

    if (this.name === 'if') {
      let index = -1;

      for (let i = this.parent.childs.length - 1; i >= 0; i--) {
        if (this.parent.childs[i] === this) {
          index = i;
          break;
        }
      }

      let next = this.parent.childs[index + 1];

      if (next !== undefined && next.name === 'else') {
        let other = '';

        for (let i of next.childs) {
          other += i.build();
        }

        value += '`;else ' + keyword + '+=`' + other;
      }
    }

    return '${((' + keyword + ')=>{' + this.name + '(' + this.value + ')' +
    keyword + '+=`' + value + '`;return ' + keyword + '})(``)}';
  }
}



const parseExpression = (template, parent) => {
  if (template.indexOf(keyword) > -1) {
    throw new Error(`${keyword} is reserved keyword`);
  }

  let node = new Expression();
  let bracket = 0;
  let brace = 0;
  let quote = 0;
  let buffer = '';
  let mode = 0;

  for (let i = 0, count = template.length; i < count; i++) {
    let char = template[i];
    let char1 = template[i + 1]; // <-- оптимизировать, добавив || '';
    let char2 = template[i + 2];
    let char3 = template[i + 3];

    if (char === '`') {
      quote = ~quote;
    }
    else if (quote === 0 && mode === 0) {
      if (
        char === 'i' && char1 === 'f' &&
        re.bracket.test(template.substr(i + 2))
      ) {
        buffer = buffer.trim();

        if (buffer !== '') {
          node.value = buffer;
          parent.append(node);
        }

        node = new Statement();
        node.name = 'if';

        buffer = '';
        mode = 2;
        char = '';

        i += 2;
      }
      else if (
        char === 'e' && char1 === 'l' && char2 === 's' && char3 === 'e' &&
        re.brace.test(template.substr(i + 4))
      ) {
        node = new Statement();
        node.name = 'else';

        buffer = '';
        mode = 1;
        char = '';

        i += 4;
      }
      else if (
        char === 'f' && char1 === 'o' && char2 === 'r' &&
        re.bracket.test(template.substr(i + 3))
      ) {
        buffer = buffer.trim();

        if (buffer !== '') {
          node.value = buffer;
          parent.append(node);
        }

        node = new Statement();
        node.name = 'for';

        buffer = '';
        mode = 2;
        char = '';

        i += 3;
      }
      else if (
        char === 'w' && char1 === 'h' && char2 === 'i' && char3 === 'l' &&
        template[i + 4] === 'e' && // <-- Замерить
        re.bracket.test(template.substr(i + 5))
      ) {
        buffer = buffer.trim();

        if (buffer !== '') {
          node.value = buffer;
          parent.append(node);
        }

        node = new Statement();
        node.name = 'while';

        buffer = '';
        mode = 2;
        char = '';

        i += 5;
      }
      else {
        buffer += char;
      }
    }
    else if (quote === 0 && mode & 2) {
      if (char === '(') {
        if (bracket === 0) {
          char = '';
        }

        bracket++;
      }
      else if (char === ')') {
        bracket--;

        if (bracket === 0) {
          if (buffer === '') {
            throw new Error('Unexpected token )');
          }

          node.value = buffer;
          buffer = '';

          mode = mode >> 1;
        }
      }

      if (bracket > 0) {
        buffer += char;
      }
    }
    else if (quote === 0 && mode & 1) {
      if (char === '{') {
        if (brace === 0) {
          char = '';
        }

        brace++;
      }
      else if (char === '}') {
        brace--;

        if (brace === 0) {
          if (buffer === '') {
            throw new Error('Template literal must start with a template head');
          }

          parent.append(node);
          parseTemplate(buffer, node);

          node = new Expression();
          buffer = '';

          mode = mode >> 1;
        }
      }

      if (brace > 0) {
        buffer += char;
      }
    }
    else {
      buffer += char; // <-- Коллекционер ковычек
    }
  }

  buffer = buffer.trim();

  if (buffer !== '') {
    node.value = buffer;
    parent.append(node);
  }
};

const parseTemplate = (template, parent = new Expression()) => {
  let node = new Text();
  let brace = 0;
  let quote = 0;
  let buffer = '';
  let mode = 0;

  for (let i = 0, count = template.length; i < count; i++) {
    let char = template[i];

    if (char === '`') {
      quote = ~quote;
    }
    else if (char === '$' && template[i + 1] === '{' && brace === 0) {
      if (buffer !== '') {
        node.value = buffer;
        parent.append(node);

        buffer = '';
      }

      char = '';
      mode = 1;
    }
    else if (quote === 0 && mode & 1) {
      if (char === '{') {
        if (brace === 0) {
          char = '';
        }

        brace++;
      }
      else if (char === '}') {
        brace--;

        if (brace === 0) {
          let bufer = buffer.trim();

          if (bufer !== '') {
            parseExpression(buffer.trim(), parent);
          }

          node = new Text();
          buffer = '';
          char = '';

          mode = mode >> 1;
        }
      }
    }

    buffer += char;
  }

  if (buffer !== '') {
    node.value = buffer;
    parent.append(node);
  }
};

const parse = (template) => {
  if (typeof template !== 'string') {
    throw new TypeError('The method argument must be of string type');
  };

  let node = new Expression();
  parseTemplate(template, node);

  return node;
};

module.exports = (template) => {
 let tree = parse(template);
 let string = tree.build();

 return string;
};

module.exports.Node = Node;
module.exports.Text = Text;
module.exports.Expression = Expression;
module.exports.Statement = Statement;
module.exports.parse = parse;
