"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("../ast");
const parse_1 = __importDefault(require("./parse"));
const nebbia = function (template) {
    return (0, parse_1.default)(template).build();
};
// Function properties preserve the legacy CommonJS public API.
exports.default = Object.assign(nebbia, {
    Node: ast_1.Node,
    Expression: ast_1.Expression,
    Statement: ast_1.Statement,
    Text: ast_1.Text,
    parse: parse_1.default
});
//# sourceMappingURL=nebbia.js.map