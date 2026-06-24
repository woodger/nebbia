"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Public package entry point: callable compiler plus CommonJS compatibility.
const compiler_1 = __importDefault(require("./compiler"));
exports.default = compiler_1.default;
// Legacy require('nebbia') must return the same callable export.
module.exports = compiler_1.default;
//# sourceMappingURL=index.js.map