const Node = require('./node');

class Text extends Node {
  constructor () {
    super();

    this.type = 1;
    this.name = '#text';
  }
}

module.exports = Text;
