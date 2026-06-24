import Node from './node';

/** Expression node compiles `${...}` values or the root template literal. */
export default class Expression extends Node {
  readonly type: number = 0;
  name: string = '#expression';

  build(): string {
    if (this.value !== '') {
      return '${' + this.value + '}';
    }

    let value = '';

    for (const i of this.children) {
      value += i.build();
    }

    value = '`' + value + '`';

    return value;
  }
}
