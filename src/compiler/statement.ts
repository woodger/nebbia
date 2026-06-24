import Node from './node';

/** Statement-node компилирует поддержанные JavaScript blocks внутри шаблона. */
export default class Statement extends Node {
  readonly type: number = 2;
  name = '';

  build(): string {
    if (this.name === 'else' || this.name === 'else if') {
      // else-nodes исполняются через предыдущий if, чтобы сохранить старый AST shape.
      return '';
    }

    if (this.name === 'if') {
      return this.buildStatement(this.buildIfStatement());
    }

    const value = this.buildChildren(this);

    if (this.name === 'do') {
      return this.buildStatement('do ' + Node.unity + '+=`' + value + '`;while(' + this.value + ')');
    }

    return this.buildStatement(this.name + '(' + this.value + ')' + Node.unity + '+=`' + value + '`');
  }

  private buildIfStatement(): string {
    let value = 'if(' + this.value + ')' + Node.unity + '+=`' + this.buildChildren(this) + '`';

    if (this.parent === null) {
      return value;
    }

    const index = this.parent.childs.indexOf(this);

    if (index === -1) {
      return value;
    }

    for (let i = index + 1; i < this.parent.childs.length; i++) {
      const next = this.parent.childs[i];

      if (next.name === 'else if') {
        value += ';else if(' + next.value + ')' + Node.unity + '+=`' + this.buildChildren(next) + '`';
      }
      else if (next.name === 'else') {
        value += ';else ' + Node.unity + '+=`' + this.buildChildren(next) + '`';
        break;
      }
      else {
        break;
      }
    }

    return value;
  }

  private buildChildren(node: Node): string {
    let value = '';

    for (const i of node.childs) {
      value += i.build();
    }

    return value;
  }

  private buildStatement(statement: string): string {
    // Statement body пишет результат в private accumulator и возвращает его как expression.
    return '${((' + Node.unity + ')=>{' + statement + ';return ' + Node.unity + '})(``)}';
  }
}
