var DSON = require('../../'),
	expect = require('chai').expect;

function CustomFn() {
	return 'Hello';
}

CustomFn.prototype.test = 'TestValue';


describe('DSON <Function>', function(){

		var dson = DSON.stringify(CustomFn);
		it('should stringify the code as well as the prototype', function() {
			expect(dson).to.equal('{"$function":"' + CustomFn.toString().replace(/\n/g, '\\n').replace(/\t/g,'\\t') + '","prototype":{"test":"TestValue"}}');
		});

		var val = DSON.parse(dson);

		it('should recreate the function', function() {
			expect(typeof val).to.equal('function');
			expect(val()).to.equal('Hello');
			expect(val.prototype.constructor).to.equal(val);
			expect(val.prototype.test).to.equal('TestValue');
		});



	
});