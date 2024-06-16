"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expression = void 0;
const node_1 = require("./node");
class Expression extends node_1.Node {
    type = 0;
    name = '#expression';
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
exports.Expression = Expression;
