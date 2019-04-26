class Node {
  constructor () {
    this.type = null;
    this.name = null;
    this.parent = null;
    this.childs = [];
    this.value = '';
  }

  append (child) {
    child.parent = this;
    this.childs.push(child);
  }

  build () {
    return this.value;
  }
}

module.exports = Node;
Node.unity = '__string__';
