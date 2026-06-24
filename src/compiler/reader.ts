/**
 * Reads source fragments for the Nebbia parser.
 *
 * This file owns cursor movement, balanced delimiter matching, and quoted JavaScript preservation.
 * It must not create AST nodes, recognize Nebbia statements, or generate output code.
 */

/** JavaScript quote characters that can hide template delimiters from the parser. */
export type Quote = '\'' | '"' | '`';

export type ReadResult = {
  /** Parsed substring without outer delimiters. */
  value: string;
  /** Index of the closing delimiter or quote where the reader stopped. */
  end: number;
};

/** Skips leading whitespace before reading a balanced fragment. */
export function readBalancedAfter(
  template: string,
  start: number,
  open: string,
  close: string,
  quoteDepth: number
): ReadResult {
  return readBalanced(template, skipWhitespace(template, start), open, close, quoteDepth);
}

/**
 * Reads a balanced fragment and ignores delimiters that belong to quoted JavaScript.
 *
 * quoteDepth keeps raw template text untouched while still protecting nested JavaScript expressions.
 */
export function readBalanced(
  template: string,
  start: number,
  open: string,
  close: string,
  quoteDepth: number
): ReadResult {
  let value = '';
  let depth = 0;

  for (let i = start, count = template.length; i < count; i++) {
    const char = template[i];

    if (depth >= quoteDepth && isQuote(char)) {
      const quoted = readQuoted(template, i);

      if (depth > 0) {
        value += quoted.value;
      }

      i = quoted.end;
      continue;
    }

    if (char === open) {
      if (depth > 0) {
        value += char;
      }

      depth++;
      continue;
    }

    if (char === close) {
      depth--;

      if (depth === 0) {
        return {
          value,
          end: i
        };
      }

      value += char;
      continue;
    }

    if (depth > 0) {
      value += char;
    }
  }

  return {
    value,
    end: template.length - 1
  };
}

/** Reads a quoted JavaScript fragment as-is, including delimiters and escaped characters. */
export function readQuoted(template: string, start: number): ReadResult {
  const quote = template[start];
  let value = quote;
  let escaped = false;

  for (let i = start + 1, count = template.length; i < count; i++) {
    const char = template[i];
    value += char;

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (char === quote) {
      return {
        value,
        end: i
      };
    }
  }

  return {
    value,
    end: template.length - 1
  };
}

/** Returns the first non-whitespace index at or after start. */
export function skipWhitespace(template: string, start: number): number {
  let i = start;

  while (i < template.length && /^\s$/.test(template[i])) {
    i++;
  }

  return i;
}

/** Skips one optional semicolon after a parsed do...while condition. */
export function skipOptionalSemicolon(template: string, start: number): number {
  const next = skipWhitespace(template, start + 1);

  if (template[next] === ';') {
    return next;
  }

  return start;
}

/** Checks whether a character starts a JavaScript quoted fragment. */
export function isQuote(char: string): char is Quote {
  return char === '\'' || char === '"' || char === '`';
}
