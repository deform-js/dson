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