import assert from 'node:assert';
import { Text } from '../src';

describe('class nebbia.Text', () => {
  it('Positive: Must be backwards compatible with #require', () => {
    assert(require('../src').Text === Text);
  });

  it('Positive: The "class Text" must be of function type', () => {
    assert(typeof Text === 'function');
  });

  it('Positive: constructor: new Text()', () => {
    const node = new Text();

    assert(node.type === 1);
    assert(node.name === '#text');
  });
});
