import assert from 'assert';
import nebbia from '../src';

describe('class nebbia.Statement', () => {
  it('Positive: The "class Statement" must be of function type', () => {
    assert(typeof nebbia.Statement === 'function');
  });

  it('Positive: constructor: new Statement()', () => {
    const node = new nebbia.Statement();

    assert(node.type === 2);
    assert(node.name === '');
  });
});
