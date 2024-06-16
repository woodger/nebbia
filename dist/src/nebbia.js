"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("./node");
const expression_1 = require("./expression");
const statement_1 = require("./statement");
const text_1 = require("./text");
const parse_1 = __importDefault(require("./parse"));
function nebbia(template) {
    return (0, parse_1.default)(template).build();
}
exports.default = nebbia;
Object.assign(nebbia, {
    Node: node_1.Node,
    Expression: expression_1.Expression,
    Statement: statement_1.Statement,
    Text: text_1.Text,
    parse: parse_1.default
});
