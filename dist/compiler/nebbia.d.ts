import { Expression, Node, Statement, Text } from '../ast';
import parse from './parse';
/** Callable compiler with legacy constructor/helper properties attached to the function. */
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
