import { Expression, Node, Statement, Text } from '../ast';
import parse from './parse';

/** Callable compiler with legacy constructor/helper properties attached to the function. */
export interface INebbia {
  (template: string): string;
  Node: typeof Node;
  Expression: typeof Expression;
  Statement: typeof Statement;
  Text: typeof Text;
  parse: typeof parse;
}

const nebbia: INebbia = Object.assign(function nebbia(template: string): string {
  return parse(template).build();
}, {
  Node,
  Expression,
  Statement,
  Text,
  parse
});

export default nebbia;
