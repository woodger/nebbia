import { Expression, Node, Statement, Text } from '../ast';
import parse from './parse';

/** Callable compiler with legacy constructor/helper properties attached to the function. */
export interface INebbia {
  (template: string): string;
  [key: string]: any;
}

const nebbia: INebbia = function(template: string): string {
  return parse(template).build();
};

// Function properties preserve the legacy CommonJS public API.
export default Object.assign(nebbia, {
  Node,
  Expression,
  Statement,
  Text,
  parse
});
