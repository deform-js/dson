(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var DSON = {};

DSON.$$types = [];
DSON.$$map = Object.create(null);

function merge(a, b) {
	for(var i in b) {
		a[i] = b[i];
	}
	return a;
}


function defaultSerialize(obj) {
	return obj;
}

function defaultReconstruct(value, props) {

	if (typeof value === 'object') {
		if (Array.isArray(value)) {
			var obj = Object.create(this.prototype);
			this.apply(obj, Array.isArray(value) ? value : [value]);
			return obj;
		} else {
			return merge(Object.create(this.prototype), value);
		}		
	} else {
		return new this(value);
	}


}

var hasOwn = Object.hasOwnProperty;

var defaultOptions = {

};

function exclude(keys, filter) {
	if (!filter) return keys;
	switch(typeof filter) {
		case 'function':
			return keys.filter(function(key) { return !filter(key); });
		case 'object':
			if (Array.isArray(filter)) {
				return keys.filter(function(key) { return filter.indexOf(key) < 0 });
			}
			return keys.filter(function(key) { return !filter[key] });
		case 'boolean':
			return filter ? [] : keys ;
		case 'string':
			if (!filter) break;
			filter = filter.split(/\s+/);
			return keys.filter(function(key) { return filter.indexOf(key) < 0 });
		default:
			return keys;
	}

}

DSON.register = function register(id, constructor, serialize, reconstruct, options) {
	if (!options) {
		if (reconstruct && typeof reconstruct === 'object') {
			options = reconstruct;
			reconstruct = null;
		} else if (serialize && typeof serialize === 'object') {
			options = serialize;
			serialize = null;
		}
	}

	id = /^\$/.test(id) ? id : '$' + id;
	options = options || defaultOptions;
	serialize =		serialize	|| options.serialize	|| defaultSerialize;
	reconstruct =	reconstruct	|| options.reconstruct	|| defaultReconstruct;


	Object.defineProperty(constructor.prototype, 'toJSON', {
		enumerable: false,
		configurable: true,
		writable: true,
		value: function(key) {
			if (key === id) return this;
			
			var value = this,
				out = {},
				excludeFilter = options.exclude,
				serial = serialize.call(out, value),
				keys = Object.getOwnPropertyNames(value),
				i;

			out[id] = serial;

			if (!options.noFilter) {
				keys = keys.filter(function(key) {
					return !hasOwn.call(serial, key);
				});		
			}

			keys = exclude(keys, excludeFilter);

			if (options.collapse && keys.length === 0) {
				return out[id];
			}

			if (!options.noMerge) {
				for (i = keys.length - 1; i >= 0; i--) {
					out[keys[i]] = value[keys[i]];
				}
			}

			return out;	
		}
	});

	this.$$types.push(this.$$map[id] = {
		id: id,
		constructor:	constructor,
		proto:			constructor.prototype,
		serialize:		serialize	|| options.serialize	|| defaultSerialize,
		reconstruct:	reconstruct	|| options.reconstruct	|| defaultReconstruct,
		options: 		options
	});

};

var $RE = /^\$/;


function reconstruct(prop, value) {

	if (!value || typeof value !== 'object') return value;

	for(var key in value) break;

	var type;

	// console.log('key:', key, 'value:', value);

	if (!$RE.test(key) || !(type = DSON.$$map[key])) return value;

	var data = value[key];

	// delete value[key];

	var out = type.reconstruct.call(type.constructor, data, value);

	for(var i in value) {
		if (i === type.id) continue;
		out[i] = value[i];
	}

	return out;

}

DSON.defaultSerialize = defaultSerialize;
DSON.defaultReconstruct = defaultReconstruct;
DSON.defaultOptions = defaultOptions;


DSON.stringify = JSON.stringify;

DSON.reviver = reconstruct;

DSON.parse = function parse(str, trans) {
	return JSON.parse(str, reconstruct);
};

module.exports = DSON;
},{}],2:[function(require,module,exports){
var DSON = require('./core');
require('./types');

module.exports = DSON;
},{"./core":1,"./types":6}],3:[function(require,module,exports){
var DSON = require('../core');

DSON.register('$array', Array, function(arr) {
	return arr.slice();
}, function(value) {
	return value;
}, {
	collapse: true
});
},{"../core":1}],4:[function(require,module,exports){
var DSON = require('../core');

DSON.register('$date', Date, function(date) {
	return date.getTime();
}, function(time) {
	return new Date(time);
});

},{"../core":1}],5:[function(require,module,exports){
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
},{"../core":1}],6:[function(require,module,exports){
require('./array');
require('./date');
require('./regex');
require('./function');



/**
 *	JSON.register(id, constructor, [serialize], [construct], [options])
 *
 *	@param	{String} 			id				unique identifier for serialization
 *
 *	@param	{Function} 			constructor		Constructor function
 *
 *	@param	{Function} 	(opt)	serialize		Serializing function 
 *												returns a value that the `construct` 
 *												function will be called with.
 *												default: 
 *												```
 *													function(obj) {
 *														return obj;
 *													}
 *												```
 *												
 *	@param	{Function} 	(opt)	construct		Reconstructing function 
 *												returns the reconstructed object
 *												default: 
 *												```
 *													function(Constructor, value) {
 *														var obj = Object.create(Constructor.prototype);
 *														Constructor.apply(obj, Array.isArray(value) ? value : [value])
 *														return obj;
 *													}
 *												```
 *												
 *	@param	{Object} 	(opt)	options			Hash of options 
 *	
 *			{Boolean}	[false]	noMerge			DSON will not automatically merge the object's
 *												own properties with the return value of the 
 *												`construct` function
 *												
 *			{Boolean}	[false]	collapse		If no own properties other than those returned
 *												by the `serialize` function, the result will be
 *												serialized as a basic JSON value.  e.g.:
 *												```
 *													function Collapsable(name) {
 *														this.name = name;
 *													};
 *													
 *													DSON.register('$collapsable', Collapsable, function(obj){
 *														return [obj.name]
 *													}, {
 *														collapse:true
 *													});
 *													DSON.stringify(new Collapseable('myName'))
 *														// => '["name"]' as opposed to '{"$collapsable": ["name"]}'
 *												```
 *												This option is mostly for internal use — You shouldn't need it.
 *
 *			{Array}		[null]	exclude			List of properties that will not be serialized.  Differs fom 
 *												`noMerge` in that the properties will not be available during
 *												reconstruction.  If set to `true` all properties will be excluded
 * 
 */	


},{"./array":3,"./date":4,"./function":5,"./regex":7}],7:[function(require,module,exports){
var DSON = require('../core');


DSON.register('$regex', RegExp, function(re) {
	return [
		re.source, 
		re.toString().split('/').pop()
	];
}, function(re){
	return new RegExp(re[0], re[1]);
},{
	exclude: ['source', 'global', 'ignoreCase', 'multiline', 'lastIndex']
});
},{"../core":1}]},{},[2])