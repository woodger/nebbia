"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = __importDefault(require("./node"));
/** Statement node compiles supported JavaScript control blocks inside templates. */
class Statement extends node_1.default {
    type = 2;
    name = '';
    build() {
        if (this.isBranchStatement()) {
            // Branch nodes are emitted by the preceding if to preserve the legacy AST shape.
            return '';
        }
        return this.buildStatement(this.buildStatementNode(this));
    }
    buildIfStatement() {
        let value = 'if(' + this.value + '){' + this.buildChildren(this) + '}';
        if (this.parent === null) {
            return value;
        }
        const index = this.parent.children.indexOf(this);
        if (index === -1) {
            return value;
        }
        for (let i = index + 1; i < this.parent.children.length; i++) {
            const next = this.parent.children[i];
            if (next.name === 'else if') {
                value += 'else if(' + next.value + '){' + this.buildChildren(next) + '}';
            }
            else if (next.name === 'else') {
                value += 'else{' + this.buildChildren(next) + '}';
                break;
            }
            else {
                break;
            }
        }
        return value;
    }
    buildChildren(node) {
        let value = '';
        let template = '';
        for (const i of node.children) {
            if (i instanceof Statement) {
                value += this.buildTemplateAppend(template);
                value += this.buildStatementNode(i);
                template = '';
            }
            else {
                template += i.build();
            }
        }
        value += this.buildTemplateAppend(template);
        return value;
    }
    buildStatementNode(node) {
        if (node.isBranchStatement()) {
            return '';
        }
        if (node.isControlStatement()) {
            node.assertInsideIteration();
            return node.name + ';';
        }
        if (node.name === 'if') {
            return node.buildIfStatement();
        }
        if (node.name === 'do') {
            return 'do{' + this.buildChildren(node) + '}while(' + node.value + ')';
        }
        return node.name + '(' + node.value + '){' + this.buildChildren(node) + '}';
    }
    buildStatement(statement) {
        // Statement bodies write into the private accumulator and return it as an expression.
        return '${((' + node_1.default.unity + ')=>{' + statement + ';return ' + node_1.default.unity + '})(``)}';
    }
    buildTemplateAppend(value) {
        if (value === '') {
            return '';
        }
        return node_1.default.unity + '+=`' + value + '`;';
    }
    assertInsideIteration() {
        let parent = this.parent;
        while (parent !== null) {
            if (parent instanceof Statement && parent.isIterationStatement()) {
                return;
            }
            parent = parent.parent;
        }
        throw new Error(`Statement "${this.name}" must be used inside iteration statements`);
    }
    isBranchStatement() {
        return this.name === 'else' || this.name === 'else if';
    }
    isControlStatement() {
        return this.name === 'break' || this.name === 'continue';
    }
    isIterationStatement() {
        return this.name === 'for' || this.name === 'while' || this.name === 'do';
    }
}
exports.default = Statement;
//# sourceMappingURL=statement.js.map