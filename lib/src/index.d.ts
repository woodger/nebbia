import Node from './node';
import Expression from './expression';
import Statement from './statement';
import Text from './text';
import parse from './parse';
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
