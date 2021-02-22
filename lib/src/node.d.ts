export default abstract class Node {
    readonly type: number | null;
    readonly childs: Array<Node>;
    parent: Node | null;
    name: string | null;
    value: string;
    static unity: string;
    append(child: Node): void;
    build(): string;
}
