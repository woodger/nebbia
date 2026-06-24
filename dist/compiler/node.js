"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Базовый AST-node для compiler tree. */
class Node {
    type = null;
    children = [];
    parent = null;
    name = null;
    value = '';
    // Внутренний accumulator name не может встречаться в пользовательском шаблоне.
    static unity = '__string__';
    append(child) {
        child.parent = this;
        this.children.push(child);
    }
    build() {
        return this.value;
    }
}
exports.default = Node;
//# sourceMappingURL=node.js.map