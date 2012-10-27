;(function (soma, undefined) {

	'use strict';

	var VERBOSE_COMPILE = false;
	var VERBOSE_RENDER = false;
	var VERBOSE_INTERPOLATION = true;

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
		token: new RegExp(tokens.start + "(.*?)" + tokens.end, "gm"),
		expression: new RegExp(tokens.start + "|" + tokens.end, "gm"),
		node: /<(.|\n)*?>/gi,
		trim: /^[\s+]+|[\s+]+$/g,
		repeat: /(.*)\s+in\s+(.*)/,
		findFunction: /(.*)\((.*)\)/,
		findFunctionPath: /(.*)\.(.*)\(/,
		findParams: /,\s+|,|\s+,\s+/,
		findString: /('|")(.*)('|")/,
		findQuote: /\"|\'/g,
		findExtraQuote: /^["|']|["|']?$/g,
		findContent: /[^\s]/gm,
		findTokens: new RegExp(tokens.start + ".*?" + tokens.end, "g"), //new RegExp(tokens.start + ".*" + tokens.end + "+", "g"), // /\{\{(.*?)\}\}/g
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
	function trimTokens(value) {
		return value.replace(regex.expression, '');
	}
	var HashMap = function(){
		var uuid = function(a,b){for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');return b;}
		var getKey = function(target) {
			if (!target) return;
			if (typeof target !== 'object') return target;
			return target.hashkey ? target.hashkey : target.hashkey = uuid();
		}
		return {
			put: function(key, value) {
				this[getKey(key)] = value;
			},
			get: function(key) {
				return this[getKey(key)];
			},
			remove: function(key) {
				delete this[getKey(key)];
			}
		}
	};

	// node

	var Node = function(element, value, attributes) {
		this.element = element;
		this.value = value;
		this.attributes = attributes;
		this.sequence = getSequence(value);
		if (VERBOSE_COMPILE) console.log('            node text sequence:', this.sequence);
	}

	var Attribute = function(element, name, value) {
		this.element = element;
		this.name = name;
		this.values = trim(value).split(regex.findWhitespace);
		this.nameSequence = getSequence(this.name);
		this.valuesSequence = getSequence(this.values);
		if (VERBOSE_COMPILE) console.log('            attribute[name] sequence:', this.nameSequence);
		if (VERBOSE_COMPILE) console.log('            attribute[values] sequence:', this.valuesSequence);
	}

	// interpolation

	function isExpFunction(value) {
		console.log(value.match(regex.findFunction));
		return !!value.match(regex.findFunction);
	}

	var Pattern = function(value) {
		this.value = value;
		this.expression = value.replace(regex.expression);
		if (VERBOSE_INTERPOLATION) console.log('    > expression', this.expression);
		if (VERBOSE_INTERPOLATION) console.log('    > is function', isExpFunction(this.expression));
	};

	var Interpolation = function(value) {
		if (VERBOSE_INTERPOLATION) console.log('--- INTERPOLATION ---');
		this.value = value;
		this.pattern = new Pattern(trimTokens(value));
	};

	function getInterpolationPart(value) {
		var parts = [];
		var val = trim(value);
		var tokensMatches = val.match(regex.findTokens);
		var nonTokensMatches = val.split(regex.findTokens);
		var i = -1, l = nonTokensMatches.length;
		while (++i < l) {
			parts.push(nonTokensMatches[i]);
			if (tokensMatches && tokensMatches[i]) {
				var interpolation = new Interpolation(tokensMatches[i]);
				parts.push(interpolation);
			}
		}
		return trimArray(parts);
	}

	function getSequence(value) {
		if (!value) return null;
		var sequence = [];
		if (isArray(value)) {
			var i = -1, l = value.length;
			while (++i < l) {
				sequence.push(getInterpolationPart(value[i]));
			}
		}
		else {
			sequence.push(getInterpolationPart(value));
		}
		return sequence;
	}

	function hasInterpolation(value) {
		var matches = value.match(regex.token);
		if (matches && matches.length > 0) if (VERBOSE_COMPILE) console.log('            has interpolation', matches);
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

	function addInterpolationNodeToList(interpolationNode, node, nodeList) {
		if (interpolationNode) nodeList.put(node, interpolationNode);
	}

	function compileNodes(node, nodeList) {
		if (!isNodeValid(node)) return;
		if (VERBOSE_COMPILE) console.log('    > compile node:', node);
		var analyseFunc = node.nodeType === 3 ? analyseTextNode : analyseNode;
		addInterpolationNodeToList(analyseFunc(node), node, nodeList);
		// children
		var child = node.firstChild;
		while (child) {
			compileNodes(child, nodeList);
			child = child.nextSibling;
		}
	}

	function analyseTextNode(node) {
		if (VERBOSE_COMPILE) console.log('        analyse TEXT', node);
		if (hasInterpolation(node.nodeValue)) {
			var n = new Node(node, node.nodeValue);
			if (VERBOSE_COMPILE) console.log('            node created:', n);
			return n;
		}
		return null;
	}

	function analyseNode(node) {
		var attributes;
		for (var attr, name, value, attrs = node.attributes, j = 0, jj = attrs && attrs.length; j < jj; j++) {
			attr = attrs[j];
			if (attr.specified) {
				name = attr.name;
				value = attr.value;
				if (VERBOSE_COMPILE) console.log('        analyse NODE', '[attr]', attr, '[name]', name, '[value]', value);
				if (hasInterpolation(name + ':' + value)) {
					if (!attributes) attributes = [];
					var a = new Attribute(node, name, value);
					attributes.push(a);
					if (VERBOSE_COMPILE) console.log('            attribute created', a);
				}
			}
		}
		if (attributes) {
			var n = new Node(node, node.nodeValue, attributes);
			if (VERBOSE_COMPILE) console.log('            node created', n);
			return n;
		}
		return null;
	}

	function compile(element) {
		if (VERBOSE_COMPILE) console.log('--- COMPILE ---', element);
		var template;
		if (!(template = templates.get(element))) {
			template = new Template(element);
			templates.put(element, template);
		}
		template.compile();
		return template;
	}

	// template

	var templates = new HashMap();

	var Template = function(element) {

		this.element = element;

		var nodeList;

		function compileTemplate() {
			// TODO: dispose previous has map
			nodeList = new HashMap();
			compileNodes(element, nodeList);

			console.log('    >>> NODE LIST', nodeList);

		}

		return {
			render: render,
			compile: compileTemplate
		}
	};

	// render

	function render(data) {
		if (VERBOSE_RENDER) console.log('--- RENDER ---');

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
	soma.template.compile = compile;

})(this['soma'] = this['soma'] || {});