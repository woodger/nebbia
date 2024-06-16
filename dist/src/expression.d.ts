import { Node } from './node';
export declare class Expression extends Node {
    readonly type: number;
    name: string;
    build(): string;
}
