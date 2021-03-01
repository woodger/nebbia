import Node from './node';
import Expression from './expression';
import Statement from './statement';
import Text from './text';
import parse from './parse';

export interface INebbia {
  (template: string): string;
  [key: string]: any
}

const nebbia = <INebbia>function(template: string): string {
  return parse(template).build();
}

export default Object.assign(nebbia, {
  Node,
  Expression,
  Statement,
  Text,
  parse
});

module.exports = nebbia;
