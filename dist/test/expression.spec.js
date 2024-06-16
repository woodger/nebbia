"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const src_1 = require("../src");
describe('class bebbia.Expression', () => {
    it('Positive: Must be backwards compatible with #require', () => {
        (0, node_assert_1.default)(require('../src').Expression === src_1.Expression);
    });
    it('Positive: The "class Expression" must be of function type', () => {
        (0, node_assert_1.default)(typeof src_1.Expression === 'function');
    });
    it('Positive: constructor: new Expression()', () => {
        const node = new src_1.Expression();
        (0, node_assert_1.default)(node.type === 0);
        (0, node_assert_1.default)(node.name === '#expression');
    });
});
