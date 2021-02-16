import assert from 'assert';
import nebbia from '../src';

describe('class nebbia.Statement', () => {
  it('The "class Statement" must be of function type', () => {
    assert(typeof nebbia.Statement === 'function');
  });

  it('constructor: new Statement()', () => {
    const node = new nebbia.Statement();

    assert(node.type === 2);
    assert(node.name === '');
  });
});
