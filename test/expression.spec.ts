import assert from 'node:assert';
import { Expression } from '../src';

describe('class bebbia.Expression', () => {
  it('Positive: Must be backwards compatible with #require', () => {
    assert(require('../src').Expression === Expression);
  });

  it('Positive: The "class Expression" must be of function type', () => {
    assert(typeof Expression === 'function');
  });

  it('Positive: constructor: new Expression()', () => {
    const node = new Expression();

    assert(node.type === 0);
    assert(node.name === '#expression');
  });
});
