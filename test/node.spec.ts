import assert from 'assert';
import nebbia from '../src';

describe('class nebbia.Node', () => {
  it('Positive: The "class Node" must be of function type', () => {
    assert(typeof nebbia.Node === 'function');
  });
});
