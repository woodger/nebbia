import assert from 'assert';
import nebbia from '../src';

describe('class bebbia.Expression', () => {
  it('Positive: The "class Expression" must be of function type', () => {
    assert(typeof nebbia.Expression === 'function');
  });

  it('Positive: constructor: new Expression()', () => {
    const node = new nebbia.Expression();

    assert(node.type === 0);
    assert(node.name === '#expression');
  });
});
