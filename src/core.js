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