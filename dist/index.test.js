"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const compiler_1 = __importStar(require("./compiler"));
const index_1 = __importDefault(require("./index"));
(0, node_test_1.describe)('interface module', () => {
    (0, node_test_1.test)('is backwards compatible with require', () => {
        strict_1.default.strictEqual(require('./index'), index_1.default);
    });
    (0, node_test_1.test)('exports callable compiler', () => {
        strict_1.default.strictEqual(typeof index_1.default, 'function');
    });
    (0, node_test_1.test)('uses the compiler implementation', () => {
        strict_1.default.strictEqual(index_1.default, compiler_1.default);
    });
    (0, node_test_1.test)('exposes public compiler contracts', () => {
        const required = require('./index');
        strict_1.default.strictEqual(typeof index_1.default.parse, 'function');
        strict_1.default.strictEqual(typeof index_1.default.Node, 'function');
        strict_1.default.strictEqual(typeof index_1.default.Expression, 'function');
        strict_1.default.strictEqual(typeof index_1.default.Statement, 'function');
        strict_1.default.strictEqual(typeof index_1.default.Text, 'function');
        strict_1.default.strictEqual(index_1.default.parse, compiler_1.parse);
        strict_1.default.strictEqual(index_1.default.Node, compiler_1.Node);
        strict_1.default.strictEqual(index_1.default.Expression, compiler_1.Expression);
        strict_1.default.strictEqual(index_1.default.Statement, compiler_1.Statement);
        strict_1.default.strictEqual(index_1.default.Text, compiler_1.Text);
        strict_1.default.strictEqual(required.parse, compiler_1.parse);
        strict_1.default.strictEqual(required.Node, compiler_1.Node);
        strict_1.default.strictEqual(required.Expression, compiler_1.Expression);
        strict_1.default.strictEqual(required.Statement, compiler_1.Statement);
        strict_1.default.strictEqual(required.Text, compiler_1.Text);
    });
});
//# sourceMappingURL=index.test.js.map