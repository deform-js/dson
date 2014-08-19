dson
====

Dynamic Stateful Object Notation 


JSON extension that preserves type information for sharing code between server and client


### Example

```
shared-class.js
```

```javascript

function ClassName(info) {
	this.info = info
}

DSON.register('$classname', ClassName)

```

```
server.js
```

```javascript

var ClassName = require('./shared-class');

app.use(bodyParser({
	reviver: DSON.reviver
}));

app.get('/data', function(req, res){
	res.send({obj: new ClassName({hello: 'world'})})
})

```

```
client.js
```

```javascript

var ClassName = require('./shared-class');

$.get('/data', function(data) {
	data = DSON.parse(data);
	console.log(data.obj instanceof ClassName) // => true
})

```

### Pre-registered (can be overwritten)

Array $array — only used if there are non-numerical properties

```javascript
var arr = ['asdf', {}, 6]

arr.special = true;

var copy = DSON.parse(DSON.stringify(arr));

console.log(arr.special) // => true

```

RegExp $regex

Date $date

Function $function 




DSON.register(id, constructor, [serialize], [construct], [options])

	@param	{String} 			id				unique identifier for serialization

	@param	{Function} 			constructor		Constructor function

	@param	{Function} 	(opt)	serialize		Serializing function 
												returns a value that the `construct` 
												function will be called with.
												default: 
												```
													function(obj) {
														return obj;
													}
												```
												
	@param	{Function} 	(opt)	construct		Reconstructing function 
												returns the reconstructed object
												default: 
												```
													function(Constructor, value) {
														var obj = Object.create(Constructor.prototype);
														Constructor.apply(obj, Array.isArray(value) ? value : [value])
														return obj;
													}
												```
												
	@param	{Object} 	(opt)	options			Hash of options 

			{Boolean}	[false]	noMerge			DSON will not automatically merge the object's
												own properties with the return value of the 
												`construct` function
												
			{Boolean}	[false]	collapse		If no own properties other than those returned
												by the `serialize` function, the result will be
												serialized as a basic JSON value.  e.g.:
												```
													function Collapsable(name) {
														this.name = name;
													};
													
													DSON.register('$collapsable', Collapsable, function(obj){
														return [obj.name]
													}, {
														collapse:true
													});
													DSON.stringify(new Collapseable('myName'))
														// => '["name"]' as opposed to '{"$collapsable": ["name"]}'
												```
												This option is mostly for internal use — You shouldn't need it.

			{Array}		[null]	exclude			List of properties that will not be serialized.  Differs fom 
												`noMerge` in that the properties will not be available during
												reconstruction.  If set to `true` all properties will be excluded