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

