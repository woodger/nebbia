// Граница compiler-слоя: runtime compiler и публичные AST-контракты.
export { default } from './nebbia';
export type { INebbia } from './nebbia';
export { default as Node } from './node';
export { default as Expression } from './expression';
export { default as Statement } from './statement';
export { default as Text } from './text';
export { default as parse } from './parse';
