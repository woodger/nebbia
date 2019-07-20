const assert = require('assert');
const Text = require('../src/text');

describe('class Text', () => {
	describe('Interaface', () => {
		it('The "class Text" must be of function type', () => {
			assert(typeof Text === 'function');
		});

		it('constructor: new Text()', () => {
	    const node = new Text();

			assert(
				node.type === 1 &&
	    	node.name === '#text'
			);
	  });
	});
});
