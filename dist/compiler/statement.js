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
        let value = '';
        if (this.name === 'else') {
            // else-node исполняется через предыдущий if, чтобы сохранить старый AST shape.
            return '';
        }
        for (const i of this.childs) {
            value += i.build();
        }
        if (this.name === 'if' && this.parent !== null) {
            let index = -1;
            for (let i = this.parent.childs.length - 1; i >= 0; i--) {
                if (this.parent.childs[i] === this) {
                    index = i;
                    break;
                }
            }
            const next = this.parent.childs[index + 1];
            if (next !== undefined && next.name === 'else') {
                let other = '';
                for (const i of next.childs) {
                    other += i.build();
                }
                value += '`;else ' + node_1.default.unity + '+=`' + other;
            }
        }
        // Statement body пишет результат в private accumulator и возвращает его как expression.
        value = '${((' + node_1.default.unity + ')=>{' + this.name + '(' + this.value + ')' +
            node_1.default.unity + '+=`' + value + '`;return ' + node_1.default.unity + '})(``)}';
        return value;
    }
}
exports.default = Statement;
//# sourceMappingURL=statement.js.map