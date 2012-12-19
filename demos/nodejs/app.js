var express = require('express'),
	jsdom = require('jsdom').jsdom,
	fs = require('fs'),
	template = require('soma-template');

var app = express();

app.configure(function () {
	app.use(express.logger('dev'));
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.favicon());
	app.use("/styles", express.static(__dirname + '/static/styles'));
});

app.get('/', function(req, res) {
	res.redirect('/Node.js');
});

app.get('/:path', function(req, res) {
	getTemplate(__dirname + '/views/index.html', function(err, tpl, doc) {
		tpl.scope.name = req.params.path;
		tpl.scope.links = getLinks();
		tpl.render();
		res.send(doc.innerHTML);
	});
});

app.listen(3000);
console.log('Listening on port 3000');

function getTemplate(path, callback) {
	fs.readFile(path, 'utf8', function (err, data) {
		if (err) callback(err, undefined);
		else {
			var document = jsdom(data);
			callback(undefined, template.create(document.body), document);
		}
	});
}

function getLinks() {
	return [
		{ name: 'Click here', url: '/click-here' },
		{ name: 'Try another', url: '/try-another' },
		{ name: 'And the last link', url: '/and-the-last-link' },
		{ name: 'Send me home', url: '/' }
	]
}
