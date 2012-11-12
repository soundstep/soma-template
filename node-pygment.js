var pygments = require('pygments');
var highlight = pygments.colorize;

console.log(pygments);
console.log(highlight);

highlight('puts "Hello World"', 'ruby', 'console', function(data) {
	console.log(data);
});