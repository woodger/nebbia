import Node from './node';

export default class Text extends Node {
  readonly type: number = 1;
  name: string = '#text';
}
