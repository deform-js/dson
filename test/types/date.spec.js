var DSON = require('../../'),
	expect = require('chai').expect;

describe('DSON <Date>', function(){

	describe('<Date>', function() {
		var date = new Date(2014,6,25,12,28,30);
		var dson = DSON.stringify(date);
		it('should serialize with $date', function() {
			expect(dson).to.equal('{"$date":' + date.getTime() + '}');
		});
		var val = DSON.parse(dson);
		it('should parse to an instance of Date', function() {
			expect(typeof val).to.equal('object');
			expect(val instanceof Date).to.equal(true);
			expect(val.getTime()).to.equal(date.getTime());
		});
	});

	
});