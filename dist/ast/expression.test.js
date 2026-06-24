"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const expression_1 = __importDefault(require("./expression"));
(0, node_test_1.describe)('class Expression', () => {
    (0, node_test_1.test)('exports constructor function', () => {
        strict_1.default.strictEqual(typeof expression_1.default, 'function');
    });
    (0, node_test_1.test)('initializes default type and name', () => {
        const node = new expression_1.default();
        strict_1.default.strictEqual(node.type, 0);
        strict_1.default.strictEqual(node.name, '#expression');
    });
});
//# sourceMappingURL=expression.test.js.map