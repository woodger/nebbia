import Node from './node';
/** Expression-node компилирует `${...}` или корневой template literal. */
export default class Expression extends Node {
    readonly type: number;
    name: string;
    build(): string;
}
