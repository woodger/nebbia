const assert = require('assert');
const Expression = require('../src/expression');

describe('class Expression', () => {
	describe('Interaface', () => {
		it('The "class Expression" must be of function type', () => {
			assert(typeof Expression === 'function');
		});

		it('constructor: new Expression()', () => {
	    const node = new Expression();

			assert(
				node.type === 0 &&
				node.name === '#expression'
			);
	  });
	});
});
