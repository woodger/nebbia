import Node from './node';
import Expression from './expression';
import Statement from './statement';
import Text from './text';
import parse from './parse';

export default function nebbia(template: string): string {
  return parse(template).build();
}

Object.assign(nebbia, {
  Node,
  Expression,
  Statement,
  Text,
  parse
});
