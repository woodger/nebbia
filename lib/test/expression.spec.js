"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const src_1 = __importDefault(require("../src"));
describe('class bebbia.Expression', () => {
    it('Positive: Must be backwards compatible with #require', () => {
        assert_1.default(require('../src').Expression === src_1.default.Expression);
    });
    it('Positive: The "class Expression" must be of function type', () => {
        assert_1.default(typeof src_1.default.Expression === 'function');
    });
    it('Positive: constructor: new Expression()', () => {
        const node = new src_1.default.Expression();
        assert_1.default(node.type === 0);
        assert_1.default(node.name === '#expression');
    });
});
//# sourceMappingURL=expression.spec.js.map