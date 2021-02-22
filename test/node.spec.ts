import assert from 'assert';
import nebbia from '../src';

describe('class nebbia.Node', () => {
  it('Positive: Must be backwards compatible with #require', () => {
    assert(require('../src').Node === nebbia.Node);
  });

  it('Positive: The "class Node" must be of function type', () => {
    assert(typeof nebbia.Node === 'function');
  });
});
