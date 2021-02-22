"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = __importDefault(require("./node"));
const expression_1 = __importDefault(require("./expression"));
const statement_1 = __importDefault(require("./statement"));
const text_1 = __importDefault(require("./text"));
const parse_1 = __importDefault(require("./parse"));
function nebbia(template) {
    return parse_1.default(template).build();
}
exports.default = nebbia;
Object.assign(nebbia, {
    Node: node_1.default,
    Expression: expression_1.default,
    Statement: statement_1.default,
    Text: text_1.default,
    parse: parse_1.default
});
//# sourceMappingURL=nebbia.js.map