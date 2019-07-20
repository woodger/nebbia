const Node = require('./node');

class Statement extends Node {
  constructor () {
    super();

    this.type = 2;
    this.name = '';
  }

  build () {
    let value = '';
    let other = '';

    if (this.name === 'else') {
      return '';
    }

    for (let i of this.childs) {
      value += i.build();
    }

    if (this.name === 'if') {
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

module.exports = Statement;
