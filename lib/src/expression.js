"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = __importDefault(require("./node"));
class Expression extends node_1.default {
    constructor() {
        super(...arguments);
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
        value = '`' + value + '`';
        return value;
    }
}
exports.default = Expression;
//# sourceMappingURL=expression.js.map