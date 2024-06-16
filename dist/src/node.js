"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
class Node {
    type = null;
    childs = [];
    parent = null;
    name = null;
    value = '';
    static unity = '__string__';
    append(child) {
        child.parent = this;
        this.childs.push(child);
    }
    build() {
        return this.value;
    }
}
exports.Node = Node;
