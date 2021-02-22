"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const src_1 = __importDefault(require("../src"));
describe('class nebbia.Text', () => {
    it('Positive: Must be backwards compatible with #require', () => {
        assert_1.default(require('../src').Text === src_1.default.Text);
    });
    it('Positive: The "class Text" must be of function type', () => {
        assert_1.default(typeof src_1.default.Text === 'function');
    });
    it('Positive: constructor: new Text()', () => {
        const node = new src_1.default.Text();
        assert_1.default(node.type === 1);
        assert_1.default(node.name === '#text');
    });
});
//# sourceMappingURL=text.spec.js.map