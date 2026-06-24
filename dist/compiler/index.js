"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.Text = exports.Statement = exports.Expression = exports.Node = exports.default = void 0;
// Compiler boundary: runtime compiler and public AST contracts.
var nebbia_1 = require("./nebbia");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return __importDefault(nebbia_1).default; } });
var ast_1 = require("../ast");
Object.defineProperty(exports, "Node", { enumerable: true, get: function () { return ast_1.Node; } });
Object.defineProperty(exports, "Expression", { enumerable: true, get: function () { return ast_1.Expression; } });
Object.defineProperty(exports, "Statement", { enumerable: true, get: function () { return ast_1.Statement; } });
Object.defineProperty(exports, "Text", { enumerable: true, get: function () { return ast_1.Text; } });
var parse_1 = require("./parse");
Object.defineProperty(exports, "parse", { enumerable: true, get: function () { return __importDefault(parse_1).default; } });
//# sourceMappingURL=index.js.map