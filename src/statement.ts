import { Node } from './node';

export class Statement extends Node {
  readonly type: number = 2;
  name = '';

  build(): string {
    let value = '';

    if (this.name === 'else') {
      return '';
    }

    for (let i of this.childs) {
      value += i.build();
    }

    if (this.name === 'if' && this.parent !== null) {
      let index = -1;

      for (let i = this.parent.childs.length - 1; i >= 0; i--) {
        if (this.parent.childs[i] === this) {
          index = i;
          break;
        }
      }

      const next = this.parent.childs[index + 1];

      if (next !== undefined && next.name === 'else') {
        let other = '';

        for (let i of next.childs) {
          other += i.build();
        }

        value += '`;else ' + Node.unity + '+=`' + other;
      }
    }

    value = '${((' + Node.unity + ')=>{' + this.name + '(' + this.value + ')' +
            Node.unity + '+=`' + value + '`;return ' + Node.unity + '})(``)}';

    return value;
  }
}
