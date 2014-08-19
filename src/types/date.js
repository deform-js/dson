var DSON = require('../core');

DSON.register('$date', Date, function(date) {
	return date.getTime();
}, function(time) {
	return new Date(time);
});
