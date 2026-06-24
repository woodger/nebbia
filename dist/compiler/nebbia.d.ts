import Node from './node';
import Expression from './expression';
import Statement from './statement';
import Text from './text';
import parse from './parse';
/** Callable compiler с историческими constructor/helper-свойствами на функции. */
export interface INebbia {
    (template: string): string;
    [key: string]: any;
}
declare const _default: INebbia & {
    Node: typeof Node;
    Expression: typeof Expression;
    Statement: typeof Statement;
    Text: typeof Text;
    parse: typeof parse;
};
export default _default;
