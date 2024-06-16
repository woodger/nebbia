"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const src_1 = require("../src");
describe('class nebbia.Node', () => {
    it('Positive: Must be backwards compatible with #require', () => {
        (0, node_assert_1.default)(require('../src').Node === src_1.Node);
    });
    it('Positive: The "class Node" must be of function type', () => {
        (0, node_assert_1.default)(typeof src_1.Node === 'function');
    });
});
