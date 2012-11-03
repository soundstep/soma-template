soma.template = soma.source || {};
soma.template.version = "0.0.1";

var errors = soma.template.errors = {
	TEMPLATE_STRING_NO_ELEMENT: "Error in soma.template, a string template requirement a second parameter: an element target - soma.template.create('string', element)",
	TEMPLATE_NO_PARAM: "Error in soma.template, a template requires at least 1 parameter - soma.template.create(element)",
	REPEAT_WRONG_ARGUMENTS: "Error in soma.template, repeat attribute requires this syntax: 'item in items'."
};

var settings = soma.template.settings = soma.template.settings || {};

var tokens = settings.tokens = {
	start:"{{",
	end:"}}"
};

var regex = settings.regex = {
	sequence: new RegExp(tokens.start + ".+?" + tokens.end + "|[^" + tokens.start + "]+", "g"), //    \{\{.+?\}\}|[^{]+|\{(?!\{)
	token: new RegExp(tokens.start + ".*?" + tokens.end, "g"),
	expression: new RegExp(tokens.start + "|" + tokens.end, "gm"),
	escape: /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
	trim: /^[\s+]+|[\s+]+$/g,
	repeat: /(.*)\s+in\s+(.*)/,
	func: /(.*)\((.*)\)/,
	params: /,\s+|,|\s+,\s+/,
	quote: /\"|\'/g,
	content: /[^.|^\s]/gm

	// todo: need to escape the tokens when the user is settings them

	// todo: info about the sequence regex: \{\{.+?\}\}|[^{]+|\{(?!\{)
	// todo: need the last option: \{(?!\{) in case the tokens.start is at least 2 characters, for 1 character only the first options are enough
	// this means substr the tokens, need to that on unescaped tokens

};

var attributes = settings.attributes = {
	skip: "data-skip",
	repeat: "data-repeat",
	src: "data-src",
	href: "data-href",
	show: "data-show",
	hide: "data-hide",
	cloak: "data-cloak"
};

var vars = settings.vars = {
	index: "$index",
	key: "$key"
};
