import assert from 'node:assert';
import { Node } from '../src';

describe('class nebbia.Node', () => {
  it('Positive: Must be backwards compatible with #require', () => {
    assert(require('../src').Node === Node);
  });

  it('Positive: The "class Node" must be of function type', () => {
    assert(typeof Node === 'function');
  });
});
