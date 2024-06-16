"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Statement = void 0;
const node_1 = require("./node");
class Statement extends node_1.Node {
    type = 2;
    name = '';
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
                value += '`;else ' + node_1.Node.unity + '+=`' + other;
            }
        }
        value = '${((' + node_1.Node.unity + ')=>{' + this.name + '(' + this.value + ')' +
            node_1.Node.unity + '+=`' + value + '`;return ' + node_1.Node.unity + '})(``)}';
        return value;
    }
}
exports.Statement = Statement;
