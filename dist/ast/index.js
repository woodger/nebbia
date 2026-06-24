"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text = exports.Statement = exports.Expression = exports.Node = void 0;
/**
 * Groups compiler AST node contracts behind a single import boundary.
 *
 * This file owns only AST model exports. Parser, reader, and compiler facade
 * code should live outside this boundary.
 */
var node_1 = require("./node");
Object.defineProperty(exports, "Node", { enumerable: true, get: function () { return __importDefault(node_1).default; } });
var expression_1 = require("./expression");
Object.defineProperty(exports, "Expression", { enumerable: true, get: function () { return __importDefault(expression_1).default; } });
var statement_1 = require("./statement");
Object.defineProperty(exports, "Statement", { enumerable: true, get: function () { return __importDefault(statement_1).default; } });
var text_1 = require("./text");
Object.defineProperty(exports, "Text", { enumerable: true, get: function () { return __importDefault(text_1).default; } });
//# sourceMappingURL=index.js.map