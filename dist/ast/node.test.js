"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const node_1 = __importDefault(require("./node"));
(0, node_test_1.describe)('class Node', () => {
    (0, node_test_1.test)('exports constructor function', () => {
        strict_1.default.strictEqual(typeof node_1.default, 'function');
    });
    (0, node_test_1.test)('appends child nodes to children collection', () => {
        class TestNode extends node_1.default {
        }
        const parent = new TestNode();
        const child = new TestNode();
        parent.append(child);
        strict_1.default.deepStrictEqual(parent.children, [child]);
        strict_1.default.strictEqual(child.parent, parent);
    });
});
//# sourceMappingURL=node.test.js.map