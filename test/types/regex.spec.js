var DSON = require('../../'),
	expect = require('chai').expect;

describe('DSON <RegExp>', function(){

	describe('<RegExp>', function() {
		var regex = /^aa\$aa$/g;
		var dson = DSON.stringify(regex);

		it('should be serialized with $regex', function() {
			expect(dson).to.equal('{"$regex":["^aa\\\\$aa$","g"]}');
		});

		var val = DSON.parse(dson);
		it('should parse to a RegExp', function() {
			expect(typeof val).to.equal('object');
			expect(val instanceof RegExp).to.equal(true);
			expect(val.toString()).to.equal(regex.toString());
			expect(val.test('aa$aa')).to.equal(true);
		});

	});
	
});