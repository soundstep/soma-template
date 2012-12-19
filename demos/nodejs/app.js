var express = require('express'),
	doc = require('jsdom').jsdom(),
	template = require('soma-template');

var app = express();

app.get('/', function(req, res){
	res.send('Hello World');
});

app.listen(3000);
console.log('Listening on port 3000');