import { Node } from './node';

export class Expression extends Node {
  readonly type: number = 0;
  name: string = '#expression';

  build(): string {
    if (this.value !== '') {
      return '${' + this.value + '}';
    }

    let value = '';

    for (let i of this.childs) {
      value += i.build();
    }

    value = '`' + value + '`';

    return value;
  }
}
