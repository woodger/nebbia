import Node from './node';
import Expression from './expression';
import Text from './text';
import Statement from './statement';

// Parser строит AST для исторического синтаксиса `nebbia` без выполнения JavaScript.
export default function parse(template: string): Node {
  const ast = new Expression();
  parseTemplate(template, ast);

  return ast;
}

function parseExpression(template: string, parent: Node): void {
  // Compiler использует marker как имя accumulator, поэтому шаблон не должен его затенять.
  if (template.indexOf(Node.unity) > -1) {
    throw new Error(`Reserved expression marker "${Node.unity}" cannot be used in templates`);
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
  // mode: 0 ищет expression/statement, 2 читает (...), 1 читает {...}.
  let mode = 0;

  for (let i = 0, count = template.length; i < count; i++) {
    let char = template[i];
    const char1 = template[i + 1];
    const char2 = template[i + 2];
    const char3 = template[i + 3];

    if (char === '`') {
      quote = ~quote;
    }
    else if (quote === 0 && mode === 0) {
      // Statement keywords распознаются только на верхнем уровне expression.
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
        i += 4;
      }
      else {
        buffer += char;
      }
    }
    else if (quote === 0 && mode & 2) {
      // Первая фаза statement собирает условие/iterator между внешними скобками.
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
            throw new Error(`Statement "${node.name}" must include content between parentheses`);
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
      // Вторая фаза statement собирает вложенный template body между внешними braces.
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
            throw new Error(`Statement "${node.name}" must include template content inside braces`);
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
  // mode отделяет raw text от содержимого `${...}`.
  let mode = 0;

  for (let i = 0, count = template.length; i < count; i++) {
    let char = template[i];

    if (char === '`') {
      quote = ~quote;
    }
    else if (char === '$' && template[i + 1] === '{' && brace === 0) {
      // Только top-level `${` начинает compiler expression, вложенные braces остаются внутри.
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
          const expression = buffer.trim();

          if (expression !== '') {
            parseExpression(expression, parent);
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
