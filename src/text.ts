import { Node } from './node';

export class Text extends Node {
  readonly type: number = 1;
  name: string = '#text';
}
