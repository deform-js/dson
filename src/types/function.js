var DSON = require('../core');

var _eval = eval;

DSON.register('$function', Function, function(fn) {
	return fn.toString();
}, function(code, props) {
	var fn = _eval('(' + code + ')');
	for(var i in props.prototype) fn.prototype[i] = props.prototype[i];
	delete props.prototype;
	return fn;

}, {
	exclude: ['caller', 'arguments', 'name']
});