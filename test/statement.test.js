const assert = require('assert');
const Statement = require('../src/statement');

describe('class Statement', () => {
	describe('Interaface', () => {
		it('The "class Statement" must be of function type', () => {
			assert(typeof Statement === 'function');
		});

		it('constructor: new Statement()', () => {
	    const node = new Statement();
	    assert(node.type === 2);
	  });
	});
});
