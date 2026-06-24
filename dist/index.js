"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Публичная точка входа пакета: callable compiler и CommonJS compatibility.
const compiler_1 = __importDefault(require("./compiler"));
exports.default = compiler_1.default;
// Исторический require('nebbia') должен возвращать тот же callable export.
module.exports = compiler_1.default;
//# sourceMappingURL=index.js.map