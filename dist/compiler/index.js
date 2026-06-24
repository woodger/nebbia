"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.Text = exports.Statement = exports.Expression = exports.Node = exports.default = void 0;
// Граница compiler-слоя: runtime compiler и публичные AST-контракты.
var nebbia_1 = require("./nebbia");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return __importDefault(nebbia_1).default; } });
var node_1 = require("./node");
Object.defineProperty(exports, "Node", { enumerable: true, get: function () { return __importDefault(node_1).default; } });
var expression_1 = require("./expression");
Object.defineProperty(exports, "Expression", { enumerable: true, get: function () { return __importDefault(expression_1).default; } });
var statement_1 = require("./statement");
Object.defineProperty(exports, "Statement", { enumerable: true, get: function () { return __importDefault(statement_1).default; } });
var text_1 = require("./text");
Object.defineProperty(exports, "Text", { enumerable: true, get: function () { return __importDefault(text_1).default; } });
var parse_1 = require("./parse");
Object.defineProperty(exports, "parse", { enumerable: true, get: function () { return __importDefault(parse_1).default; } });
//# sourceMappingURL=index.js.map