"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const src_1 = __importDefault(require("../src"));
describe('class nebbia.Statement', () => {
    it('Positive: Must be backwards compatible with #require', () => {
        assert_1.default(require('../src').Statement === src_1.default.Statement);
    });
    it('Positive: The "class Statement" must be of function type', () => {
        assert_1.default(typeof src_1.default.Statement === 'function');
    });
    it('Positive: constructor: new Statement()', () => {
        const node = new src_1.default.Statement();
        assert_1.default(node.type === 2);
        assert_1.default(node.name === '');
    });
});
//# sourceMappingURL=statement.spec.js.map