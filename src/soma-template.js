;(function (soma, undefined) {

	'use strict';

	var VERBOSE = false;

	soma.template = soma.source || {};
	soma.template.version = "0.0.1";

	var errors = soma.template.errors = {
		COMPILE_NO_ELEMENT: "Error in soma.template, no target specified: template.source(element).compile(data).",
		REPEAT_WRONG_ARGUMENTS: "Error in soma.template, repeat attribute requires this syntax: 'item in items'."
	};
	var settings = soma.template.settings = soma.template.settings || {};
	var tokens = settings.tokens = {
		start:"{{",
		end:"}}"
	};
	var regex = settings.regex = {
		attrs: new RegExp("([-A-Za-z0-9" + tokens.start + tokens.end + "(())._]+)(?:\s*=\s*(?:(?:\"((?:\\.|[^\"])*)\")|(?:'((?:\\.|[^'])*)')|([^>\u0020|\u0009]+)))?", "g"),
		token:new RegExp(tokens.start + "(.*?)" + tokens.end, "gm"),
		path:new RegExp(tokens.start + "|" + tokens.end, "gm"),
		node: /<(.|\n)*?>/gi,
		trim: /^[\s+]+|[\s+]+$/g,
		repeat:/(.*)\s+in\s+(.*)/,
		findFunction:/(.*)\((.*)\)/,
		findFunctionPath: /(.*)\.(.*)\(/,
		findParams:/,\s+|,|\s+,\s+/,
		findString:/('|")(.*)('|")/,
		findQuote:/\"|\'/g,
		findExtraQuote: /^["|']|["|']?$/g,
		findContent: /[^\s]/gm,
		findTokens: /\{\{\w+\}\}/g,
		findWhitespace: /\s+/g
	};
	var attributes = settings.attributes = {
		skip:"data-skip",
		repeat:"data-repeat",
		src:"data-src",
		href:"data-href",
		show:"data-show",
		hide:"data-hide"
	};
	var vars = settings.vars = {
		index:"index"
	};

	// utils

	var isArray = function(value) {
		return Object.prototype.toString.apply(value) === '[object Array]';
	};
	var isObject = function(value) {
		return typeof value === 'object';
	}
	var isElement = function(value) {
		return value ? value.nodeType > 0 : false;
	};
	function trim(value) {
		return value.replace(regex.trim, '');
	}
	function trimArray(value) {
		if (value[0] === "") value.shift();
		if (value[value.length-1] === "") value.pop();
		return value;
	}

	// elements

	var Element = function(element) {
		return {
			element: element
		}
	}

	// template

	var templates = [];

	var Template = function() {

	}

	// node

	var Node = function(element, value, attributes) {
		this.element = element;
		this.value = value;
		this.attributes = attributes;
		this.parts = getInterpolationParts(value, false);
	}

	var Attribute = function(element, name, value) {
		this.element = element;
		this.name = name;
		this.value = trim(value).split(regex.findWhitespace);
		console.log('VALUE SPLIT', this.value);
		console.log('--NAME');
		this.nameParts = getInterpolationParts(this.name, true);
		console.log('--VALUE');
		this.valueParts = getInterpolationParts(this.value, true);
	}

	// interpolation

	var InterpolationPart = function() {

	}

	function createInterpolationPart() {

	}

	function getInterpolationParts(value, shouldTrim) {
		if (!value) return null;
		var parts = [];
		if (isArray(value)) {
			var i = -1, l = value.length;
			while (++i < l) {
				var valueParts = [];
				console.log('    VALUE[' + value + ']');
				var val = trim(value[i]);
				var tokensMatches = val.match(regex.findTokens);
				var nonTokensMatches = val.split(regex.findTokens);
				console.log('    GET TOKENS', val.match(regex.findTokens));
				console.log('    GET NON TOKENS', val.split(regex.findTokens));
				var m = -1, n = nonTokensMatches.length;
				while (++m < n) {
					valueParts.push(nonTokensMatches[m]);
					if (tokensMatches && tokensMatches[m]) valueParts.push(tokensMatches[m]);
				}
				console.log('    FINAL', trimArray(valueParts));
			}
			parts.push(valueParts);
		}
		else {
			console.log('VALUE[' + value + ']');
			var val = trim(value);
			var tokensMatches = val.match(regex.findTokens);
			var nonTokensMatches = val.split(regex.findTokens);
			console.log('GET TOKENS', val.match(regex.findTokens));
			console.log('GET NON TOKENS', val.split(regex.findTokens));
			var m = -1, n = nonTokensMatches.length;
			while (++m < n) {
				parts.push(nonTokensMatches[m]);
				if (tokensMatches && tokensMatches[m]) parts.push(tokensMatches[m]);
			}
			if (shouldTrim) console.log('FINAL',  trimArray(parts));
			else console.log('FINAL',  parts);
		}
		return parts;
	}

	function hasInterpolation(value) {
		var matches = value.match(regex.token);
		if (matches && matches.length > 0) console.log('        has interpolation', matches);
		return matches && matches.length > 0;
	}

	// compile

	function isNodeValid(node) {
		// comment
		if (node.nodeType === 8) return false;
		// empty text node
		if (node.nodeType === 3 && !regex.findContent.test(node.nodeValue)) return false;
		// result
		return true;
	}

	function compileNodes(node) {
		if (!isNodeValid(node)) return;
		console.log('    > compile node:', node);
		if (node.nodeType === 3) analyseTextNode(node);
		else analyseNode(node);
		// children
		var child = node.firstChild;
		while (child) {
			compileNodes(child);
			child = child.nextSibling;
		}
	}

	function analyseTextNode(node) {
		console.log('        analyse TEXT', node);
		if (hasInterpolation(node.nodeValue)) {
			var n = new Node(node, node.nodeValue);
			console.log('        found interpolation, create node', n);
		}
	}

	function analyseNode(node) {
		var attributes;
		for (var attr, name, value, attrs = node.attributes, j = 0, jj = attrs && attrs.length; j < jj; j++) {
			attr = attrs[j];
			if (attr.specified) {
				name = attr.name;
				value = attr.value;
				console.log('        analyse NODE', '[attr]', attr, '[name]', name, '[value]', value);
				if (hasInterpolation(name + ':' + value)) {
					if (!attributes) attributes = [];
					var a = new Attribute(node, name, value);
					attributes.push(a);
					console.log('        found interpolation, create attribute', a);
				}
			}
		}
		if (attributes) {
			var n = new Node(node, node.nodeValue, attributes);
			console.log('        found interpolation, create node', n);
		}
	}

	function Compile(element) {
		console.log('--- COMPILE ---', element);
		var el = element;

		compileNodes(el);

		return {
			render: Render
		}
	}

	// render

	function Render(data) {
		console.log('--- RENDER ---');
	}

	// register for AMD module
	if (typeof define === 'function' && define.amd) {
		define("soma-template", soma);
	}

	// export for node.js
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = soma;
		}
		exports = soma;
	}

	// export
	soma.template.compile =  Compile;

})(this['soma'] = this['soma'] || {});