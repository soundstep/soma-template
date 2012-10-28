;(function (soma, undefined) {

	'use strict';

	var VERBOSE_COMPILE = false;
	var VERBOSE_RENDER = true;
	var VERBOSE_INTERPOLATION = false;

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
	function isInterpolation(value) {
		return typeof value === 'object' && value.expression;
	}
	function equals(o1, o2) {
		if (o1 === o2) return true;
		if (o1 === null || o2 === null) return false;
		if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN
		var t1 = typeof o1, t2 = typeof o2, length, key, keySet;
		if (t1 == t2) {
			if (t1 == 'object') {
				if (isArray(o1)) {
					if ((length = o1.length) == o2.length) {
						for(key=0; key<length; key++) {
							if (!equals(o1[key], o2[key])) return false;
						}
						return true;
					}
				} else if (isDate(o1)) {
					return isDate(o2) && o1.getTime() == o2.getTime();
				} else {
					keySet = {};
					for(key in o1) {
						if (!isFunction(o1[key]) && !equals(o1[key], o2[key])) {
							return false;
						}
						keySet[key] = true;
					}
					for(key in o2) {
						if (!keySet[key] && key.charAt(0) !== '$' && !isFunction(o2[key])) return false;
					}
					return true;
				}
			}
		}
		return false;
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
		this.valueRendered;
		this.attributes = attributes;
		this.sequence = getSequence(value, true);
		if (VERBOSE_COMPILE) console.log('            node text sequence:', this.sequence);
	}
	Node.prototype.render = function(data) {
		this.renderValue(data);
		this.renderAttributes(data);
	}
	Node.prototype.renderValue = function(data) {
		if (!this.sequence) return;
		var newValue = renderSequence(this.sequence, data);
		if (newValue !== this.valueRendered) {
			this.element.nodeValue = this.valueRendered = newValue;
			console.log('            > RENDER VALUE', this.valueRendered);
		}
	}
	Node.prototype.renderAttributes = function(data) {
		if (!this.attributes) return;
		console.log('            > render attributes', this.attributes);
		var i = -1, l = this.attributes.length;
		while (++i < l) {
			this.attributes[i].render(data);
		}
	}

	var Attribute = function(element, name, value) {
		this.element = element;
		this.name = name;
		this.nameRendered;
		this.values = trim(value).split(regex.findWhitespace);
		this.valuesRendered = [];
		this.nameSequence = getSequence(this.name);
		this.valuesSequence = getSequence(this.values);
		this.hasNameChanged = false;
		this.hasValuesChanged = false;
		this.previousName;
		if (VERBOSE_COMPILE) console.log('            attribute[name] sequence:', this.nameSequence);
		if (VERBOSE_COMPILE) console.log('            attribute[values] sequence:', this.valuesSequence);
	}
	Attribute.prototype.render = function(data) {
		this.hasNameChanged = false;
		this.hasValuesChanged = false;
		this.renderName(data);
		this.renderValues(data);
		if (!this.hasNameChanged && !this.hasValuesChanged) return;
		if (this.hasNameChanged && this.previousName) {
			this.element.removeAttribute(this.previousName);
		}
		this.previousName = this.nameRendered;
		if (this.nameRendered === "class" && this.element.className) {
			this.element.className = this.valuesRendered.join(" ");
		}
		else {
			this.element.setAttribute(this.nameRendered, this.valuesRendered.join(" "));
			this.element.removeAttribute(this.name);
		}
		console.log('                > RENDER ATTRIBUTE:', this.nameRendered, this.valuesRendered);
	}
	Attribute.prototype.renderName = function(data) {
		if (!this.nameSequence) return;
		var newName = renderSequence(this.nameSequence, data);
		if (newName !== this.nameRendered) {
			this.hasNameChanged = true;
			this.nameRendered = newName;
		}
	}
	Attribute.prototype.renderValues = function(data) {
		var newValues = [];
		var i = -1, l = this.valuesSequence.length;
		while (++i < l) {
			if (this.valuesSequence[i]) {
				newValues.push(renderSequence(this.valuesSequence[i], data));
			}
		}
		if (!equals(newValues, this.valuesRendered)) {
			this.hasValuesChanged = true;
			this.valuesRendered = newValues;
		}
	}

	function renderSequence(sequence, data) {
		var rendered = "";
		if (sequence) {
			var i = -1, l = sequence.length;
			while (++i < l) {
				var part = sequence[i];
				rendered += isInterpolation(part) ? part.render(data) : part;
			}
		}
		return rendered;
	}

	// interpolation

	function isExpFunction(value) {
		return !!value.match(regex.findFunction);
	}

	function getExpressionPath(value) {
		var val = value.split('(')[0];
		return val.substr(0, val.lastIndexOf("."));
	}

	function getExpressionName(value) {
		var val = value.split('(')[0];
		return val.substring(val.lastIndexOf(".")).replace('.', '');
	}

	function getParamsFromString(str) {
		return str.split(regex.findParams);
	}

	var Expression = function(value) {
		this.value = value;
		this.valueRendered;
		this.isFunction = isExpFunction(this.value)
		this.path = getExpressionPath(this.value);
		this.name = getExpressionName(this.value);
		this.params = !this.isFunction ? null : getParamsFromString(value.match(regex.findFunction)[2]);
		if (VERBOSE_INTERPOLATION) console.log('    > expression', this.value);
		if (VERBOSE_INTERPOLATION) console.log('    > is function', this.isFunction);
		if (VERBOSE_INTERPOLATION) console.log('    > path', this.path);
		if (VERBOSE_INTERPOLATION) console.log('    > name', this.name);
		if (VERBOSE_INTERPOLATION) console.log('    > params', this.params);
	};
	Expression.prototype.render = function(data) {
		var pathParts = this.path.split('.');
		if (VERBOSE_RENDER) console.log('            pathParts:', pathParts);
		var i = -1, l = pathParts.length;
		var path = data;
		if (pathParts[0] !== "") {
			while (++i < l) {
				path = path[pathParts[i]];
			}
		}
		if (!this.isFunction) {
			if (VERBOSE_RENDER) console.log('            return value:', path[this.name]);
			var newValue = path[this.name];
			return this.valueRendered = newValue ? newValue : this.value;
		}
		return null;
	}

	var Interpolation = function(value) {
		if (VERBOSE_INTERPOLATION) console.log('--- INTERPOLATION ---');
		this.value = value;
		this.valueRendered;
		this.expression = new Expression(trimTokens(value));
	};
	Interpolation.prototype.render = function(data) {
		this.valueRendered = this.expression.render(data);
		return this.valueRendered ? this.valueRendered : this.value;
	}

	function getInterpolationPart(value, isTextNode) {
		var parts = [];
		var val = !isTextNode ? trim(value) : value;
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
		return !isTextNode ? trimArray(parts) : parts;
	}

	function getSequence(value, isTextNode) {
		if (!value) return null;
		if (isArray(value)) {
			var sequence = [];
			var i = -1, l = value.length;
			while (++i < l) {
				sequence.push(getInterpolationPart(value[i]));
			}
			return sequence;
		}
		else {
			return getInterpolationPart(value, isTextNode);
		}
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

		var element = element;
		var scope = new Scope();

		var nodeList;

		function compileTemplate() {
			// TODO: dispose previous hashmap
			nodeList = new HashMap();
			compileNodes(element, nodeList);

			if (VERBOSE_COMPILE) console.log('>>> NODE LIST', nodeList);

		}

		function renderTemplate(data) {
			if (VERBOSE_RENDER) console.log('--- RENDER ---');
			if (VERBOSE_RENDER) console.log('> scope', this.scope);
			if (nodeList) renderNodes(this.scope, element, nodeList);
		}

		return {
			render: renderTemplate,
			compile: compileTemplate,
			scope: scope
		}
	};

	// render

	function renderNodes(data, node, nodeList) {
		if (!isNodeValid(node)) return;
		if (VERBOSE_RENDER) console.log('    render node list with data:', data, ", and node:", node, ", and nodeList:", nodeList);
		var interpolationNode = nodeList.get(node);
		if (interpolationNode) {
			if (VERBOSE_RENDER) console.log('        interpolationNode', interpolationNode);
			interpolationNode.render(data);
		}
		// children
		// TODO: parse interpolation nodes rather than the real dom
		var child = node.firstChild;
		while (child) {
			renderNodes(data, child, nodeList);
			child = child.nextSibling;
		}
	}

	// scope

	var Scope = function() {
		this._parent = null;
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