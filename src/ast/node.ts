/** Base AST node for the compiler tree. */
export default abstract class Node {
  readonly type: number | null = null;
  readonly children: Array<Node> = [];

  parent: Node | null = null;
  name: string | null = null;
  value: string = '';

  // The internal accumulator name is reserved in user templates.
  static unity = '__string__';

  append(child: Node): void {
    child.parent = this;
    this.children.push(child);
  }

  build(): string {
    return this.value;
  }
}
