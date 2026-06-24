"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = __importDefault(require("./node"));
/** Text node stores a literal template fragment without additional compilation. */
class Text extends node_1.default {
    type = 1;
    name = '#text';
}
exports.default = Text;
//# sourceMappingURL=text.js.map