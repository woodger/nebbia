import Node from './node';

/** AST node for `if`, loops, branches, and loop controls. */
export default class Statement extends Node {
  readonly type: number = 2;
  name = '';

  build(): string {
    const buildChildren = (node: Node): string => {
      let value = '';
      let template = '';

      for (const child of node.children) {
        if (child instanceof Statement) {
          if (template !== '') {
            value += Node.unity + '+=`' + template + '`;';
            template = '';
          }

          value += buildNode(child);
        }
        else {
          template += child.build();
        }
      }

      if (template !== '') {
        value += Node.unity + '+=`' + template + '`;';
      }

      return value;
    };

    const buildNode = (node: Statement): string => {
      if (node.name === 'else' || node.name === 'else if') {
        return '';
      }

      if (node.name === 'break' || node.name === 'continue') {
        let parent = node.parent;

        while (parent !== null) {
          if (
            parent instanceof Statement &&
            (parent.name === 'for' || parent.name === 'while' || parent.name === 'do')
          ) {
            return node.name + ';';
          }

          parent = parent.parent;
        }

        throw new Error(`Statement "${node.name}" must be used inside iteration statements`);
      }

      if (node.name === 'do') {
        return 'do{' + buildChildren(node) + '}while(' + node.value + ')';
      }

      let value = node.name + '(' + node.value + '){' + buildChildren(node) + '}';

      if (node.name === 'if' && node.parent !== null) {
        const index = node.parent.children.indexOf(node);

        if (index > -1) {
          for (let i = index + 1; i < node.parent.children.length; i++) {
            const next = node.parent.children[i];

            if (next.name === 'else if') {
              value += 'else if(' + next.value + '){' + buildChildren(next) + '}';
            }
            else if (next.name === 'else') {
              value += 'else{' + buildChildren(next) + '}';
              break;
            }
            else {
              break;
            }
          }
        }
      }

      return value;
    };

    if (this.name === 'else' || this.name === 'else if') {
      return '';
    }

    return '${((' + Node.unity + ')=>{' + buildNode(this) + ';return ' + Node.unity + '})(``)}';
  }
}
