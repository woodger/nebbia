const assert = require('assert');
const Node = require('../src/node');

describe('class Node', () => {
	describe('Interaface', () => {
		it('The "class Node" must be of function type', () => {
			assert(typeof Node === 'function');
		});

		it('constructor: new Node()', () => {
	    const node = new Node();

	    assert(
				node.type === null &&
	    	node.name === null &&
	    	node.parent === null &&
	    	node.value === '' &&
	    	node.childs instanceof Array
			);
	  });
	});
});
