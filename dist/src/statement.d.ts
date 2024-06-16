import { Node } from './node';
export declare class Statement extends Node {
    readonly type: number;
    name: string;
    build(): string;
}
