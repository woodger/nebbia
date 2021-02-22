import Node from './node';
import Expression from './expression';
import Text from './text';
import Statement from './statement';

export default function parse(template: string): Node {
  const ast = new Expression();
  parseTemplate(template, ast);

  return ast;
}

function parseExpression(template: string, parent: Node): void {
  if (template.indexOf(Node.unity) > -1) {
    throw new Error(`${Node.unity} is reserved keyword`);
  }

  const re = {
    bracket: /^\s*\(/,
    brace: /^\s*\{/
  };

  let node = new Expression();
  let bracket = 0;
  let brace = 0;
  let quote = 0;
  let buffer = '';
  let mode = 0;

  for (let i = 0, count = template.length; i < count; i++) {
    let char = template[i];
    let char1 = template[i + 1];
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
        i += 1;
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
        i += 3;
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
        i += 2;
      }
      else if (
        char === 'w' && char1 === 'h' && char2 === 'i' && char3 === 'l' &&
        template[i + 4] === 'e' && re.bracket.test(template.substr(i + 5))
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
        i += 4;
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
      buffer += char;
    }
  }

  buffer = buffer.trim();

  if (buffer !== '') {
    node.value = buffer;
    parent.append(node);
  }
}

function parseTemplate(template: string, parent: Node): void {
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
}
