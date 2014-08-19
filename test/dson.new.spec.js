var DSON = require('../'),
	expect = require('chai').expect;

function CustomA(a,b,c,d) {
	this.a = a;
	this.b = b;
	this.c = c;
	this.d = d;
	this.x = 0;
}

CustomA.prototype = {
	thing: function() {}
};

function CustomB(a,b,c,d) {
	this.a = a;
	this.b = b;
	this.c = c;
	this.d = d;
	this.x = 0;
}

CustomB.prototype = {
	thing: function() {},
};

function CustomC(re) {
	this.re = re;
	this.x = 0;
}

CustomC.prototype = {

};

function CustomD(re) {
	this.re = re;
	this.x = 0;
}

CustomD.prototype = {

};


DSON.register('$customA', CustomA);
DSON.register('$customB', CustomB, function(obj) {
	return [obj.a, obj.b, obj.c, obj.d];
}, {
	exclude: ['a','b','c','d']
});

DSON.register('$customC', CustomC);
DSON.register('$customD', CustomD, function(obj) {
	return [obj.re];
}, {
	exclude: ['re']
});

describe('DSON', function(){

	describe('<Number>', function() {
		var dson = DSON.stringify(5);

		it('should stringify normally', function() {
			expect(dson).to.equal('5');
		});

		var val = DSON.parse(dson);
		it('should parse normally', function() {
			expect(val).to.equal(5);
		});
	});

	describe('plain <Object>', function() {
		var dson = DSON.stringify({});

		it('should stringify normally', function() {
			expect(dson).to.equal('{}');
		});

		var val = DSON.parse(dson);
		it('should parse to a normal object', function() {
			expect(typeof val).to.equal('object');
			expect(Object.keys(val).length).to.equal(0);
		});
	});

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

	describe('plain <Array>', function() {
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

	describe('decorated <Array>', function() {
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

	describe('<CustomA> Class with default transform', function() {
		var obj = new CustomA(1,2,3,4);
		var dson = DSON.stringify(obj);

		it('should be serialized with $customA', function() {
			expect(dson).to.equal('{"$customA":{"a":1,"b":2,"c":3,"d":4,"x":0}}');
		});

		var val = DSON.parse(dson);

		it('should parse to an instanceof CustomA', function() {
			expect(val instanceof CustomA).to.equal(true);
			expect(val).to.deep.equal(obj);
		});

	});

	describe('<CustomB> Class with custom transform (toDSON method)', function() {
		var obj = new CustomB(1,2,3,4);
		var dson = DSON.stringify(obj);

		it('should serialize with seperate constructor arguments and instance properties', function() {
			expect(dson).to.equal('{"$customB":[1,2,3,4],"x":0}');
		});

		var val = DSON.parse(dson);

		it('should parse to an instanceof CustomA', function() {
			expect(val instanceof CustomB).to.equal(true);
			expect(val).to.deep.equal(obj);
		});


	});

	describe('<CustomC> Class with nested serializable value', function() {
		var obj = new CustomC(/^aa\$aa$/g);
		var dson = DSON.stringify(obj);

		it('should serialize the root object and any nested objects', function() {
			expect(dson).to.equal('{"$customC":{"re":{"$regex":["^aa\\\\$aa$","g"]},"x":0}}');
		});


		var val = DSON.parse(dson);

		it('should parse to an instanceof CustomA', function() {
			expect(val instanceof CustomC).to.equal(true);
			expect(val).to.deep.equal(obj);

			expect(val.re instanceof RegExp).to.equal(true);
			expect(val.re.toString()).to.equal(obj.re.toString());


		});

	});

	describe('#<CustomD> Class with nested serializable value', function() {
		var obj = new CustomD(/^aa\$aa$/g);
		var dson = DSON.stringify(obj);

		it('should serialize the root object and any nested objects', function() {
			expect(dson).to.equal('{"$customD":[{"$regex":["^aa\\\\$aa$","g"]}],"x":0}');
		});


		var val = DSON.parse(dson);

		it('should parse to an instanceof CustomA', function() {
			expect(val instanceof CustomD).to.equal(true);
			expect(val).to.deep.equal(obj);

		});

	});

	
});