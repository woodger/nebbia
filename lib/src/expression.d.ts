import Node from './node';
export default class Expression extends Node {
    readonly type: number;
    name: string;
    build(): string;
}
