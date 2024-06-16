"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text = void 0;
const node_1 = require("./node");
class Text extends node_1.Node {
    type = 1;
    name = '#text';
}
exports.Text = Text;
