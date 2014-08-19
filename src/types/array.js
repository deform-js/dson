var DSON = require('../core');

DSON.register('$array', Array, function(arr) {
	return arr.slice();
}, function(value) {
	return value;
}, {
	collapse: true
});