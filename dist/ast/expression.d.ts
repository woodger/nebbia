import Node from './node';
/** Expression node compiles `${...}` values or the root template literal. */
export default class Expression extends Node {
    readonly type: number;
    name: string;
    build(): string;
}
