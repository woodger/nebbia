import Node from './node';
/** AST node for `if`, loops, branches, and loop controls. */
export default class Statement extends Node {
    readonly type: number;
    name: string;
    build(): string;
}
