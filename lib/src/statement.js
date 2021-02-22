"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = __importDefault(require("./node"));
class Statement extends node_1.default {
    constructor() {
        super(...arguments);
        this.type = 2;
        this.name = '';
    }
    build() {
        let value = '';
        if (this.name === 'else') {
            return '';
        }
        for (let i of this.childs) {
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
                for (let i of next.childs) {
                    other += i.build();
                }
                value += '`;else ' + node_1.default.unity + '+=`' + other;
            }
        }
        value = '${((' + node_1.default.unity + ')=>{' + this.name + '(' + this.value + ')' +
            node_1.default.unity + '+=`' + value + '`;return ' + node_1.default.unity + '})(``)}';
        return value;
    }
}
exports.default = Statement;
//# sourceMappingURL=statement.js.map