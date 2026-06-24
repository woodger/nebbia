import Node from './node';

/** Text-node хранит literal fragment шаблона без дополнительной компиляции. */
export default class Text extends Node {
  readonly type: number = 1;
  name: string = '#text';
}
