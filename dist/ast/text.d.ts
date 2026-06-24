import Node from './node';
/** Text node stores a literal template fragment without additional compilation. */
export default class Text extends Node {
    readonly type: number;
    name: string;
}
