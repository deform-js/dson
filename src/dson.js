var DSON = {
	$$defined: [],
	$$prefix: '@'
};

var REMOVE = {},

	types = DSON.$$defined;



function repeat(str, n){
	return new Array(n+1).join(str);
}

function getProtoStr(obj) {

	var proto = Object.getPrototypeOf(obj);

	if (proto === Object.prototype) return true;

	if (proto === Array.prototype) {
		var keys = Object.getOwnPropertyNames(obj),
			plain = !keys.filter(function(key) {
				return /[^\d]/.test(key) && key !== 'length';
			}).length;
		return plain || '$array';
	}

	for (var i = 0, l = types.length; i < l; i++) {
		if (proto === types[i].constructor.prototype) return DSON.$$prefix + types[i].name.toLowerCase();
	}

	throw new Error('DSON Error: Undefined Prototype ' + proto);

}

function stringify(value, options, forcePlain) {

	options = options || {};

	forcePlain = forcePlain || options.plain || false;

	if (value && typeof value.toDSON === 'function') value = value.toDSON();

	if (typeof options.preprocess === 'function') value = options.preprocess.call(value, value, options);


	// What happens next depends on the value's type.

	switch (typeof value) {
		case 'string':
			
			return '\'' + value + '\'';

		case 'number':
		case 'boolean':
		case 'null':

			// If the value is a boolean or null, convert it to a string. Note:
			// typeof null does not produce 'null'. The case is included here in
			// the remote chance that this gets fixed someday.

			return String(value);

			// If the type is 'object', we might be dealing with an object or an array or
			// null.

		case 'object':

			if (!value) return 'null';

			var type = forcePlain || getProtoStr(value),

				isArr = Array.isArray(value),

				keys = Object.getOwnPropertyNames(value),

				out = {},

				els = [],

				i, l, out, els;

			if (isArr && type === true) {
				els = out[]
			} else {

			};

			if (isArr) {

				if (type !== true) {

					out +=  INDENT + type + ':' + SPACE + '{' + NEWLINE + 
							INDENT + EXTRA + DSON.$$prefix + 'elements:' + SPACE;


				}

				for (i = 0, l = value.length; i < l; i++) {
					els.push(stringify(value[i], options, level + (type === true ? 2 : 1)));
				}


				v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
				gap = mind;
				return v;
			}

			// If the replacer is an array, use it to select the members to be stringified.

			if (rep && typeof rep === 'object') {
				length = rep.length;
				for (i = 0; i < length; i += 1) {
					if (typeof rep[i] === 'string') {
						k = rep[i];
						v = str(k, value);
						if (v) {
							partial.push(quote(k) + (gap ? ': ' : ':') + v);
						}
					}
				}
			} else {

				// Otherwise, iterate through all of the keys in the object.

				for (k in value) {
					if (Object.prototype.hasOwnProperty.call(value, k)) {
						v = str(k, value);
						if (v) {
							partial.push(quote(k) + (gap ? ': ' : ':') + v);
						}
					}
				}
			}

			// Join all of the member texts together, separated with commas,
			// and wrap them in braces.

			v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
			gap = mind;
			return v;
	}
}

DSON.stringify = function(value, replacer, indent) {

	// The stringify method takes a value and an optional replacer, and an optional
	// space parameter, and returns a JSON text. The replacer can be a function
	// that can replace values, or an array of strings that will select the keys.
	// A default replacer method can be provided. Use of the space parameter can
	// produce text that is more easily readable.

	indent = indent || '';

	// If the indent parameter is a number, convert to string containing that
	// many spaces.

	if (typeof indent === 'number') {

		indent = new Array(indent + 1).join(' ');

		// If the space parameter is a string, it will be used as the indent string.

	}

	// If there is a replacer, it must be a function or an array.
	// Otherwise, throw an error.

	if (replacer && typeof replacer !== 'function' &&
		(typeof replacer !== 'object' ||
			typeof replacer.length !== 'number')) {
		throw new Error('JSON.stringify');
	}

	// Make a fake root object containing our value under the key of ''.
	// Return the result of stringifying the value.

	return stringify(value, replace, indent);

};


module.exports = new Dson();