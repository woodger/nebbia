const Node = require('./node');

class Expression extends Node {
  constructor () {
    super();

    this.type = 0;
    this.name = '#expression';
  }

  build () {
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

module.exports = Expression;
