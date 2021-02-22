"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const src_1 = __importDefault(require("../src"));
describe('class nebbia.Node', () => {
    it('Positive: Must be backwards compatible with #require', () => {
        assert_1.default(require('../src').Node === src_1.default.Node);
    });
    it('Positive: The "class Node" must be of function type', () => {
        assert_1.default(typeof src_1.default.Node === 'function');
    });
});
//# sourceMappingURL=node.spec.js.map