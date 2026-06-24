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
});
//# sourceMappingURL=node.test.js.map