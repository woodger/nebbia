"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = __importDefault(require("./node"));
/** Expression-node компилирует `${...}` или корневой template literal. */
class Expression extends node_1.default {
    type = 0;
    name = '#expression';
    build() {
        if (this.value !== '') {
            return '${' + this.value + '}';
        }
        let value = '';
        for (const i of this.children) {
            value += i.build();
        }
        value = '`' + value + '`';
        return value;
    }
}
exports.default = Expression;
//# sourceMappingURL=expression.js.map