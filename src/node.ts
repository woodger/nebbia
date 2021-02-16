export default class Node {
  readonly type: number | null = null;
  readonly childs: Array<Node> = [];

  parent: Node | null = null;
  value: string = '';
  name: string | null = null;

  static unity = '__string__';

  append(child: Node): void {
    child.parent = this;
    this.childs.push(child);
  }

  build(): string {
    return this.value;
  }
}
