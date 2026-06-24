"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = __importDefault(require("./node"));
/** Statement-node компилирует поддержанные JavaScript blocks внутри шаблона. */
class Statement extends node_1.default {
    type = 2;
    name = '';
    build() {
        if (this.name === 'else' || this.name === 'else if') {
            // else-nodes исполняются через предыдущий if, чтобы сохранить старый AST shape.
            return '';
        }
        if (this.name === 'if') {
            return this.buildStatement(this.buildIfStatement());
        }
        const value = this.buildChildren(this);
        if (this.name === 'do') {
            return this.buildStatement('do ' + node_1.default.unity + '+=`' + value + '`;while(' + this.value + ')');
        }
        return this.buildStatement(this.name + '(' + this.value + ')' + node_1.default.unity + '+=`' + value + '`');
    }
    buildIfStatement() {
        let value = 'if(' + this.value + ')' + node_1.default.unity + '+=`' + this.buildChildren(this) + '`';
        if (this.parent === null) {
            return value;
        }
        const index = this.parent.childs.indexOf(this);
        if (index === -1) {
            return value;
        }
        for (let i = index + 1; i < this.parent.childs.length; i++) {
            const next = this.parent.childs[i];
            if (next.name === 'else if') {
                value += ';else if(' + next.value + ')' + node_1.default.unity + '+=`' + this.buildChildren(next) + '`';
            }
            else if (next.name === 'else') {
                value += ';else ' + node_1.default.unity + '+=`' + this.buildChildren(next) + '`';
                break;
            }
            else {
                break;
            }
        }
        return value;
    }
    buildChildren(node) {
        let value = '';
        for (const i of node.childs) {
            value += i.build();
        }
        return value;
    }
    buildStatement(statement) {
        // Statement body пишет результат в private accumulator и возвращает его как expression.
        return '${((' + node_1.default.unity + ')=>{' + statement + ';return ' + node_1.default.unity + '})(``)}';
    }
}
exports.default = Statement;
//# sourceMappingURL=statement.js.map