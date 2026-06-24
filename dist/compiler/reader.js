"use strict";
/**
 * Reads source fragments for the Nebbia parser.
 *
 * This file owns cursor movement, balanced delimiter matching, and quoted JavaScript preservation.
 * It must not create AST nodes, recognize Nebbia statements, or generate output code.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.readBalancedAfter = readBalancedAfter;
exports.readBalanced = readBalanced;
exports.readQuoted = readQuoted;
exports.skipWhitespace = skipWhitespace;
exports.skipOptionalSemicolon = skipOptionalSemicolon;
exports.isQuote = isQuote;
/** Skips leading whitespace before reading a balanced fragment. */
function readBalancedAfter(template, start, open, close, quoteDepth) {
    return readBalanced(template, skipWhitespace(template, start), open, close, quoteDepth);
}
/**
 * Reads a balanced fragment and ignores delimiters that belong to quoted JavaScript.
 *
 * quoteDepth keeps raw template text untouched while still protecting nested JavaScript expressions.
 */
function readBalanced(template, start, open, close, quoteDepth) {
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
function readQuoted(template, start) {
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
function skipWhitespace(template, start) {
    let i = start;
    while (i < template.length && /^\s$/.test(template[i])) {
        i++;
    }
    return i;
}
/** Skips one optional semicolon after a parsed do...while condition. */
function skipOptionalSemicolon(template, start) {
    const next = skipWhitespace(template, start + 1);
    if (template[next] === ';') {
        return next;
    }
    return start;
}
/** Checks whether a character starts a JavaScript quoted fragment. */
function isQuote(char) {
    return char === '\'' || char === '"' || char === '`';
}
//# sourceMappingURL=reader.js.map