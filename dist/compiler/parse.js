"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = parse;
const node_1 = __importDefault(require("./node"));
const expression_1 = __importDefault(require("./expression"));
const text_1 = __importDefault(require("./text"));
const statement_1 = __importDefault(require("./statement"));
const READ_EXPRESSION = 0;
const READ_STATEMENT_BODY = 1;
const READ_STATEMENT_HEAD = 2;
const READ_DO_WHILE = 3;
// Parser строит AST для исторического синтаксиса `nebbia` без выполнения JavaScript.
function parse(template) {
    const ast = new expression_1.default();
    parseTemplate(template, ast);
    return ast;
}
function readControlStatement(template, offset, buffer) {
    if (buffer.trim() !== '') {
        return null;
    }
    const match = /^(break|continue)\s*;?(?=\s*$)/.exec(template.substr(offset));
    if (match === null) {
        return null;
    }
    return {
        name: match[1],
        length: match[0].length
    };
}
function parseExpression(template, parent) {
    // Compiler использует marker как имя accumulator, поэтому шаблон не должен его затенять.
    if (template.indexOf(node_1.default.unity) > -1) {
        throw new Error(`Reserved expression marker "${node_1.default.unity}" cannot be used in templates`);
    }
    const re = {
        bracket: /^\s*\(/,
        brace: /^\s*\{/
    };
    let node = new expression_1.default();
    let bracket = 0;
    let brace = 0;
    let quote = 0;
    let buffer = '';
    let mode = READ_EXPRESSION;
    let skipDoWhileSemicolon = false;
    for (let i = 0, count = template.length; i < count; i++) {
        let char = template[i];
        const char1 = template[i + 1];
        const char2 = template[i + 2];
        const char3 = template[i + 3];
        if (char === '`') {
            quote = ~quote;
        }
        else if (quote === 0 && mode === READ_EXPRESSION) {
            if (skipDoWhileSemicolon) {
                if (char === ';') {
                    skipDoWhileSemicolon = false;
                    continue;
                }
                if (!/^\s$/.test(char)) {
                    skipDoWhileSemicolon = false;
                }
            }
            const control = readControlStatement(template, i, buffer);
            const elseIf = char === 'e' ? /^else\s+if(?=\s*\()/.exec(template.substr(i)) : null;
            // Statement keywords распознаются только на верхнем уровне expression.
            if (control !== null) {
                node = new statement_1.default();
                node.name = control.name;
                parent.append(node);
                node = new expression_1.default();
                buffer = '';
                i += control.length - 1;
            }
            else if (char === 'i' && char1 === 'f' &&
                re.bracket.test(template.substr(i + 2))) {
                buffer = buffer.trim();
                if (buffer !== '') {
                    node.value = buffer;
                    parent.append(node);
                }
                node = new statement_1.default();
                node.name = 'if';
                buffer = '';
                mode = READ_STATEMENT_HEAD;
                i += 1;
            }
            else if (elseIf !== null) {
                node = new statement_1.default();
                node.name = 'else if';
                buffer = '';
                mode = READ_STATEMENT_HEAD;
                i += elseIf[0].length - 1;
            }
            else if (char === 'e' && char1 === 'l' && char2 === 's' && char3 === 'e' &&
                re.brace.test(template.substr(i + 4))) {
                node = new statement_1.default();
                node.name = 'else';
                buffer = '';
                mode = READ_STATEMENT_BODY;
                i += 3;
            }
            else if (char === 'f' && char1 === 'o' && char2 === 'r' &&
                re.bracket.test(template.substr(i + 3))) {
                buffer = buffer.trim();
                if (buffer !== '') {
                    node.value = buffer;
                    parent.append(node);
                }
                node = new statement_1.default();
                node.name = 'for';
                buffer = '';
                mode = READ_STATEMENT_HEAD;
                i += 2;
            }
            else if (char === 'w' && char1 === 'h' && char2 === 'i' && char3 === 'l' &&
                template[i + 4] === 'e' && re.bracket.test(template.substr(i + 5))) {
                buffer = buffer.trim();
                if (buffer !== '') {
                    node.value = buffer;
                    parent.append(node);
                }
                node = new statement_1.default();
                node.name = 'while';
                buffer = '';
                mode = READ_STATEMENT_HEAD;
                i += 4;
            }
            else if (char === 'd' && char1 === 'o' &&
                re.brace.test(template.substr(i + 2))) {
                buffer = buffer.trim();
                if (buffer !== '') {
                    node.value = buffer;
                    parent.append(node);
                }
                node = new statement_1.default();
                node.name = 'do';
                buffer = '';
                mode = READ_STATEMENT_BODY;
                i += 1;
            }
            else {
                buffer += char;
            }
        }
        else if (quote === 0 && mode === READ_DO_WHILE) {
            if (/^\s$/.test(char)) {
                continue;
            }
            if (char === 'w' && char1 === 'h' && char2 === 'i' && char3 === 'l' &&
                template[i + 4] === 'e' && re.bracket.test(template.substr(i + 5))) {
                buffer = '';
                mode = READ_STATEMENT_HEAD;
                i += 4;
            }
            else {
                throw new Error('Statement "do" must include while condition');
            }
        }
        else if (quote === 0 && mode === READ_STATEMENT_HEAD) {
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
                    if (node.name === 'do') {
                        parent.append(node);
                        node = new expression_1.default();
                        skipDoWhileSemicolon = true;
                        mode = READ_EXPRESSION;
                    }
                    else {
                        mode = READ_STATEMENT_BODY;
                    }
                }
            }
            if (bracket > 0) {
                buffer += char;
            }
        }
        else if (quote === 0 && mode === READ_STATEMENT_BODY) {
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
                    parseTemplate(buffer, node);
                    buffer = '';
                    if (node.name === 'do') {
                        mode = READ_DO_WHILE;
                    }
                    else {
                        parent.append(node);
                        node = new expression_1.default();
                        mode = READ_EXPRESSION;
                    }
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
    if (mode === READ_DO_WHILE) {
        throw new Error('Statement "do" must include while condition');
    }
    buffer = buffer.trim();
    if (buffer !== '') {
        node.value = buffer;
        parent.append(node);
    }
}
function parseTemplate(template, parent) {
    let node = new text_1.default();
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
                    node = new text_1.default();
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
//# sourceMappingURL=parse.js.map