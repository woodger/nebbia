import Node from './node';

/** Statement-node компилирует поддержанные JavaScript blocks внутри шаблона. */
export default class Statement extends Node {
  readonly type: number = 2;
  name = '';

  build(): string {
    if (this.isBranchStatement()) {
      // else-nodes исполняются через предыдущий if, чтобы сохранить старый AST shape.
      return '';
    }

    return this.buildStatement(this.buildStatementNode(this));
  }

  private buildIfStatement(): string {
    let value = 'if(' + this.value + '){' + this.buildChildren(this) + '}';

    if (this.parent === null) {
      return value;
    }

    const index = this.parent.children.indexOf(this);

    if (index === -1) {
      return value;
    }

    for (let i = index + 1; i < this.parent.children.length; i++) {
      const next = this.parent.children[i];

      if (next.name === 'else if') {
        value += 'else if(' + next.value + '){' + this.buildChildren(next) + '}';
      }
      else if (next.name === 'else') {
        value += 'else{' + this.buildChildren(next) + '}';
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
    let template = '';

    for (const i of node.children) {
      if (i instanceof Statement) {
        value += this.buildTemplateAppend(template);
        value += this.buildStatementNode(i);
        template = '';
      }
      else {
        template += i.build();
      }
    }

    value += this.buildTemplateAppend(template);

    return value;
  }

  private buildStatementNode(node: Statement): string {
    if (node.isBranchStatement()) {
      return '';
    }

    if (node.isControlStatement()) {
      node.assertInsideIteration();
      return node.name + ';';
    }

    if (node.name === 'if') {
      return node.buildIfStatement();
    }

    if (node.name === 'do') {
      return 'do{' + this.buildChildren(node) + '}while(' + node.value + ')';
    }

    return node.name + '(' + node.value + '){' + this.buildChildren(node) + '}';
  }

  private buildStatement(statement: string): string {
    // Statement body пишет результат в private accumulator и возвращает его как expression.
    return '${((' + Node.unity + ')=>{' + statement + ';return ' + Node.unity + '})(``)}';
  }

  private buildTemplateAppend(value: string): string {
    if (value === '') {
      return '';
    }

    return Node.unity + '+=`' + value + '`;';
  }

  private assertInsideIteration(): void {
    let parent = this.parent;

    while (parent !== null) {
      if (parent instanceof Statement && parent.isIterationStatement()) {
        return;
      }

      parent = parent.parent;
    }

    throw new Error(`Statement "${this.name}" must be used inside iteration statements`);
  }

  private isBranchStatement(): boolean {
    return this.name === 'else' || this.name === 'else if';
  }

  private isControlStatement(): boolean {
    return this.name === 'break' || this.name === 'continue';
  }

  private isIterationStatement(): boolean {
    return this.name === 'for' || this.name === 'while' || this.name === 'do';
  }
}
