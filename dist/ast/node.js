"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Base AST node for the compiler tree. */
class Node {
    type = null;
    children = [];
    parent = null;
    name = null;
    value = '';
    // The internal accumulator name is reserved in user templates.
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