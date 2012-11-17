var doc = document;
var body = document.getElementsByTagName("body")[0];
var ct = null;
var tpl;

function createContainer() {
	ct = doc.createElement('div');
	ct.setAttribute('id', 'ct');
	body.appendChild(ct);
}

function disposeContainer() {
	body.removeChild(ct);
	ct = null;
}

function createTemplate() {
	tpl = soma.template.create(ct);
}

function disposeTemplate() {
	tpl.dispose();
	tpl = null;
}

function createTemplateWithContent(content) {
	var div = doc.createElement('div');
	div.innerHTML = content;
	return soma.template.create(div);
}

// ----------------------------------------------------------
// A short snippet for detecting versions of IE in JavaScript
// without resorting to user-agent sniffing
// ----------------------------------------------------------
// If you're not in IE (or IE version is less than 5) then:
// ie === undefined
// If you're in IE (>=5) then you can determine which version:
// ie === 7; // IE7
// Thus, to detect IE:
// if (ie) {}
// And to detect the version:
// ie === 6 // IE6
// ie > 7 // IE8, IE9 ...
// ie < 9 // Anything less than IE9
// ----------------------------------------------------------

// UPDATE: Now using Live NodeList idea from @jdalton

var ie = (function(){

	var undef,
		v = 3,
		div = document.createElement('div'),
		all = div.getElementsByTagName('i');

	while (
		div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
			all[0]
		);

	return v > 4 ? v : undef;

}());
