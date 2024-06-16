"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const src_1 = require("../src");
describe('class nebbia.Text', () => {
    it('Positive: Must be backwards compatible with #require', () => {
        (0, node_assert_1.default)(require('../src').Text === src_1.Text);
    });
    it('Positive: The "class Text" must be of function type', () => {
        (0, node_assert_1.default)(typeof src_1.Text === 'function');
    });
    it('Positive: constructor: new Text()', () => {
        const node = new src_1.Text();
        (0, node_assert_1.default)(node.type === 1);
        (0, node_assert_1.default)(node.name === '#text');
    });
});
