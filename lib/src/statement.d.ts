import Node from './node';
export default class Statement extends Node {
    readonly type: number;
    name: string;
    build(): string;
}
