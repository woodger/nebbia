import assert from 'assert';
import nebbia from '../src';

describe('class nebbia.Text', () => {
  it('Positive: The "class Text" must be of function type', () => {
    assert(typeof nebbia.Text === 'function');
  });

  it('Positive: constructor: new Text()', () => {
    const node = new nebbia.Text();

    assert(node.type === 1);
    assert(node.name === '#text');
  });
});
