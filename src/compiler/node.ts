/** Базовый AST-node для compiler tree. */
export default abstract class Node {
  readonly type: number | null = null;
  readonly children: Array<Node> = [];

  parent: Node | null = null;
  name: string | null = null;
  value: string = '';

  // Внутренний accumulator name не может встречаться в пользовательском шаблоне.
  static unity = '__string__';

  append(child: Node): void {
    child.parent = this;
    this.children.push(child);
  }

  build(): string {
    return this.value;
  }
}
