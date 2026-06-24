"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = parse;
/**
 * Parses Nebbia template source into the compiler AST.
 *
 * This file owns Nebbia DSL boundary detection and AST node placement.
 * It delegates quote-aware source fragment reading to reader.ts.
 * It must not evaluate JavaScript, generate output code, or define AST node behavior.
 */
const ast_1 = require("../ast");
const reader_1 = require("./reader");
/** Parses a full template into the root expression AST node. */
function parse(template) {
    const ast = new ast_1.Expression();
    parseTemplate(template, ast);
    return ast;
}
/** Parses `${...}` content and appends expression or statement nodes to the parent AST node. */
function parseExpression(template, parent) {
    // The compiler uses this marker as the accumulator name, so templates cannot shadow it.
    if (template.indexOf(ast_1.Node.unity) > -1) {
        throw new Error(`Reserved expression marker "${ast_1.Node.unity}" cannot be used in templates`);
    }
    const re = {
        bracket: /^\s*\(/,
        brace: /^\s*\{/
    };
    let buffer = '';
    for (let i = 0, count = template.length; i < count; i++) {
        const char = template[i];
        const char1 = template[i + 1];
        const char2 = template[i + 2];
        const char3 = template[i + 3];
        if ((0, reader_1.isQuote)(char)) {
            const quoted = (0, reader_1.readQuoted)(template, i);
            buffer += quoted.value;
            i = quoted.end;
            continue;
        }
        const control = (char === 'b' || char === 'c') && buffer.trim() === '' ?
            /^(break|continue)\s*;?(?=\s*$)/.exec(template.slice(i)) :
            null;
        const elseIf = char === 'e' ? /^else\s+if(?=\s*\()/.exec(template.slice(i)) : null;
        // Statement keywords are recognized only at expression top level.
        if (control !== null) {
            const node = new ast_1.Statement();
            node.name = control[1];
            parent.append(node);
            buffer = '';
            i += control[0].length - 1;
        }
        else if (char === 'i' && char1 === 'f' &&
            re.bracket.test(template.slice(i + 2))) {
            appendExpression(buffer, parent);
            const statement = readStatement(template, i, 'if', 2);
            parent.append(statement.node);
            buffer = '';
            i = statement.end;
        }
        else if (elseIf !== null) {
            const statement = readStatement(template, i, 'else if', elseIf[0].length);
            parent.append(statement.node);
            buffer = '';
            i = statement.end;
        }
        else if (char === 'e' && char1 === 'l' && char2 === 's' && char3 === 'e' &&
            re.brace.test(template.slice(i + 4))) {
            const statement = readElseStatement(template, i);
            parent.append(statement.node);
            buffer = '';
            i = statement.end;
        }
        else if (char === 'f' && char1 === 'o' && char2 === 'r' &&
            re.bracket.test(template.slice(i + 3))) {
            appendExpression(buffer, parent);
            const statement = readStatement(template, i, 'for', 3);
            parent.append(statement.node);
            buffer = '';
            i = statement.end;
        }
        else if (char === 'w' && char1 === 'h' && char2 === 'i' && char3 === 'l' &&
            template[i + 4] === 'e' && re.bracket.test(template.slice(i + 5))) {
            appendExpression(buffer, parent);
            const statement = readStatement(template, i, 'while', 5);
            parent.append(statement.node);
            buffer = '';
            i = statement.end;
        }
        else if (char === 'd' && char1 === 'o' &&
            re.brace.test(template.slice(i + 2))) {
            appendExpression(buffer, parent);
            const statement = readDoStatement(template, i);
            parent.append(statement.node);
            buffer = '';
            i = statement.end;
        }
        else {
            buffer += char;
        }
    }
    appendExpression(buffer, parent);
}
/** Splits raw template text around compiler expressions and appends the resulting AST nodes. */
function parseTemplate(template, parent) {
    let node = new ast_1.Text();
    let buffer = '';
    for (let i = 0, count = template.length; i < count; i++) {
        const char = template[i];
        if (char === '$' && template[i + 1] === '{') {
            // Only top-level `${` starts a compiler expression; nested braces stay inside it.
            if (buffer !== '') {
                node.value = buffer;
                parent.append(node);
            }
            const expression = (0, reader_1.readBalanced)(template, i + 1, '{', '}', 1);
            if (expression.value.trim() !== '') {
                parseExpression(expression.value.trim(), parent);
            }
            node = new ast_1.Text();
            buffer = '';
            i = expression.end;
        }
        else {
            buffer += char;
        }
    }
    if (buffer !== '') {
        node.value = buffer;
        parent.append(node);
    }
}
/** Appends a non-empty JavaScript expression after trimming wrapper whitespace. */
function appendExpression(value, parent) {
    const expression = value.trim();
    if (expression !== '') {
        const node = new ast_1.Expression();
        node.value = expression;
        parent.append(node);
    }
}
/** Reads a condition-based statement block and returns the position where parsing should resume. */
function readStatement(template, start, name, keywordLength) {
    const node = new ast_1.Statement();
    const condition = (0, reader_1.readBalancedAfter)(template, start + keywordLength, '(', ')', 1);
    const body = (0, reader_1.readBalancedAfter)(template, condition.end + 1, '{', '}', 2);
    if (condition.value === '') {
        throw new Error(`Statement "${name}" must include content between parentheses`);
    }
    if (body.value === '') {
        throw new Error(`Statement "${name}" must include template content inside braces`);
    }
    node.name = name;
    node.value = condition.value;
    parseTemplate(body.value, node);
    return {
        node,
        end: body.end
    };
}
/** Reads an else block, which has a body but no condition. */
function readElseStatement(template, start) {
    const node = new ast_1.Statement();
    const body = (0, reader_1.readBalancedAfter)(template, start + 4, '{', '}', 2);
    if (body.value === '') {
        throw new Error('Statement "else" must include template content inside braces');
    }
    node.name = 'else';
    parseTemplate(body.value, node);
    return {
        node,
        end: body.end
    };
}
/** Reads a do block, whose body is followed by a separate while condition. */
function readDoStatement(template, start) {
    const node = new ast_1.Statement();
    const body = (0, reader_1.readBalancedAfter)(template, start + 2, '{', '}', 2);
    const whileStart = (0, reader_1.skipWhitespace)(template, body.end + 1);
    if (body.value === '') {
        throw new Error('Statement "do" must include template content inside braces');
    }
    if (template.slice(whileStart, whileStart + 5) !== 'while' ||
        !/^\s*\(/.test(template.slice(whileStart + 5))) {
        throw new Error('Statement "do" must include while condition');
    }
    const condition = (0, reader_1.readBalancedAfter)(template, whileStart + 5, '(', ')', 1);
    if (condition.value === '') {
        throw new Error('Statement "do" must include content between parentheses');
    }
    node.name = 'do';
    node.value = condition.value;
    parseTemplate(body.value, node);
    return {
        node,
        end: (0, reader_1.skipOptionalSemicolon)(template, condition.end)
    };
}
//# sourceMappingURL=parse.js.map