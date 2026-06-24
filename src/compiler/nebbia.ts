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

const nebbia: INebbia = function(template: string): string {
  return parse(template).build();
};

// Свойства на функции сохраняют public API старой CommonJS-версии пакета.
export default Object.assign(nebbia, {
  Node,
  Expression,
  Statement,
  Text,
  parse
});
