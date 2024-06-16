import assert from 'node:assert';
import { Statement } from '../src';

describe('class nebbia.Statement', () => {
  it('Positive: Must be backwards compatible with #require', () => {
    assert(require('../src').Statement === Statement);
  });

  it('Positive: The "class Statement" must be of function type', () => {
    assert(typeof Statement === 'function');
  });

  it('Positive: constructor: new Statement()', () => {
    const node = new Statement();

    assert(node.type === 2);
    assert(node.name === '');
  });
});
