soma.template = soma.template || {};
soma.template.version = "0.1.8";

var errors = soma.template.errors = {
	TEMPLATE_STRING_NO_ELEMENT: "Error in soma.template, a string template requirement a second parameter: an element target - soma.template.create('string', element)",
	TEMPLATE_NO_PARAM: "Error in soma.template, a template requires at least 1 parameter - soma.template.create(element)"
};

var tokenStart = '{{';
var tokenEnd = '}}';
var helpersObject = {};
var helpersScopeObject = {};

var settings = soma.template.settings = soma.template.settings || {};

settings.autocreate = true;

var tokens = settings.tokens = {
	start: function(value) {
		if (isDefined(value) && value !== '') {
			tokenStart = escapeRegExp(value);
			setRegEX(value, true);
		}
		return tokenStart;
	},
	end: function(value) {
		if (isDefined(value) && value !== '') {
			tokenEnd = escapeRegExp(value);
			setRegEX(value, false);
		}
		return tokenEnd;
	}
};

var attributes = settings.attributes = {
	skip: "data-skip",
	repeat: "data-repeat",
	src: "data-src",
	href: "data-href",
	show: "data-show",
	hide: "data-hide",
	cloak: "data-cloak",
	checked: "data-checked",
	disabled: "data-disabled",
	multiple: "data-multiple",
	readonly: "data-readonly",
	selected: "data-selected",
	template: "data-template",
	html: "data-html"
};

var vars = settings.vars = {
	index: "$index",
	key: "$key"
};

var events = settings.events = {};
settings.eventsPrefix = 'data-';
var eventsString = 'click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup focus blur change select selectstart scroll copy cut paste mousewheel keypress error contextmenu input textinput drag dragenter dragleave dragover dragend dragstart dragover drop load submit reset search resize beforepaste beforecut beforecopy';
eventsString += ' touchstart touchend touchmove touchenter touchleave touchcancel gesturestart gesturechange gestureend';
var eventsArray = eventsString.split(' ');
var i = -1, l = eventsArray.length;
while(++i < l) {
	events[settings.eventsPrefix + eventsArray[i]] = eventsArray[i];
}

var regex = {
	sequence: null,
	token: null,
	expression: null,
	escape: /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
	trim: /^[\s+]+|[\s+]+$/g,
	repeat: /(.*)\s+in\s+(.*)/,
	func: /(.*)\((.*)\)/,
	params: /,\s+|,|\s+,\s+/,
	quote: /\"|\'/g,
	content: /[^.|^\s]/gm,
	depth: /..\//g,
	string: /^(\"|\')(.*)(\"|\')$/
};
