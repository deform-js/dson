var DSON = require('../../'),
	expect = require('chai').expect;

describe('DSON <Array>', function(){


	describe('plain', function() {
		var arr = [3];
		var dson = DSON.stringify(arr);

		it('should return a simple JSON array',function() {
			expect(dson).to.equal('[3]');
		});

		var val = DSON.parse(dson);
		it('should parse to a normal array', function() {
			expect(typeof val).to.equal('object');
			expect(val instanceof Array).to.equal(true);
			expect(val.length).to.equal(arr.length);
		});
	});

	describe('decorated', function() {
		var arr = [3];
		arr.asdf = 'asdf';
		var dson = DSON.stringify(arr);

		it('should be serialized with $array', function(){
			expect(dson).to.equal('{"$array":[3],"asdf":"asdf"}');
		});

		var val = DSON.parse(dson);
		it('should parse to a normal array, with the added property', function() {
			expect(typeof val).to.equal('object');
			expect(val instanceof Array).to.equal(true);
			expect(val.length).to.equal(arr.length);
			expect(val.asdf).to.equal(arr.asdf);
		});
	});

	
});