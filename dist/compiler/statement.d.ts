import Node from './node';
/** Statement-node компилирует поддержанные JavaScript blocks внутри шаблона. */
export default class Statement extends Node {
    readonly type: number;
    name: string;
    build(): string;
    private buildIfStatement;
    private buildChildren;
    private buildStatementNode;
    private buildStatement;
    private buildTemplateAppend;
    private assertInsideIteration;
    private isBranchStatement;
    private isControlStatement;
    private isIterationStatement;
}
