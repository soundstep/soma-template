;(function (soma, undefined) {

	'use strict';

	var VERBOSE_COMPILE = true;
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
	var isString = function(value) {
		return typeof value === 'string';
	}
	var isElement = function(value) {
		return value ? value.nodeType > 0 : false;
	};
	var isFunction = function(value) {
		return typeof value === 'function';
	}
	var isDefined = function(value) {
		return value !== null && value !== undefined;
	}
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
	function isExpression(value) {
		return typeof value === 'object' && value.pattern !== undefined;
	}
	function isNode(value) {
		return typeof value === 'object' && value.sequence !== undefined;
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

	// scope

	var Scope = function(data) {
		function addScope(data, parent) {
			var obj = {
				_parent: parent,
				_children: [],
				_add: addScope
			};
			if (data && isObject(data)) {
				for (var i in data) {
					obj[i] = data[i];
				}
			}
			if (parent) parent.children.push(o);
			return obj;
		}
		return addScope(data);
	};

	// compile

	var Node = function(element) {
		this.element = element;
		this.scope;
		this.attributes;
		this.value;
		this.interpolation;
		this.invalidate = false;
		this.skip = false;

		if (this.isTextNode()) {
			this.value = element.nodeValue;
			this.interpolation = new Interpolation(this.value, this);
		}

	};
	Node.prototype = {
		isTextNode: function() {
			return this.element.nodeType === 3;
		},
		getExpressions: function() {
			var exp = (isDefined(this.interpolation)) ? this.interpolation.expressions : [];
			if (this.attributes) {
				var i = -1, l = this.attributes.length;
				while (++i < l) {
					exp = exp.concat(this.attributes[i].getExpressions());
				}
			}
			return exp;
		},
		render: function() {
			if (this.invalidate) {
				this.invalidate = false;
				if (this.isTextNode()) {
					this.element.nodeValue = this.interpolation.render();
				}
			}
			if (this.attributes) {
				var i = -1, l = this.attributes.length;
				while (++i < l) {
					this.attributes[i].render();
				}
			}
		}
	};

	var Attribute = function(name, value, node) {
		this.name = name;
		this.value = value;
		this.node = node;
		this.interpolationName = new Interpolation(this.name, null, this);
		this.interpolationValue = new Interpolation(this.value, null, this);
		this.invalidate = false;
	};
	Attribute.prototype = {
		getExpressions: function() {
			var exp = [];
			exp = exp.concat(this.interpolationName.expressions);
			exp = exp.concat(this.interpolationValue.expressions);
			return exp;
		},
		render: function() {
			var element = this.node.element;
			if (this.invalidate) {
				this.invalidate = false;
				var name = this.interpolationName.render();
				var value = this.interpolationValue.render();
				if (this.name === attributes.src) {
					renderSrc(name, value);
				}
				else {
					renderAttribute(name, value);
				}
			}
			// normal attribute
			function renderAttribute(name, value) {
				if (name == "class") {
					element.className = value;
				}
				else {
					element.setAttribute(name, value);
				}
			}
			// src attribute
			function renderSrc(name, value) {
				element.setAttribute('src', value);
			}
		}
	}

	var Interpolation = function(value, node, attribute) {
		this.value = node && !node.isTextNode() ? trim(value) : value;
		this.node = node;
		this.attribute = attribute;
		this.sequence = [];
		this.expressions = [];
		// find parts
		var val = this.value;
		var tokensMatches = val.match(regex.findTokens);
		var nonTokensMatches = val.split(regex.findTokens);
		var i = -1, l = nonTokensMatches.length;
		while (++i < l) {
			this.sequence.push(nonTokensMatches[i]);
			if (tokensMatches && tokensMatches[i]) {
				var exp = new Expression(trimTokens(tokensMatches[i]), this.node, this.attribute);
				this.sequence.push(exp);
				this.expressions.push(exp);
			}
		}
		trimArray(this.sequence);
	};
	Interpolation.prototype = {
		render: function() {
			var rendered = "";
			if (this.sequence) {
				var i = -1, l = this.sequence.length;
				while (++i < l) {
					rendered += isExpression(this.sequence[i]) ? this.sequence[i].value : this.sequence[i];
				}
			}
			return rendered;
		}
	};

	var Expression = function(pattern, node, attribute) {
		this.pattern = pattern;
		this.node = node;
		this.attribute = attribute;
		this.isFunction = isExpFunction(this.pattern);
		this.path = getExpressionPath(this.pattern);
		this.accessor = getExpressionAccessor(this.pattern);
		this.params = !this.isFunction ? null : getParamsFromString(this.pattern.match(regex.findFunction)[2]);
		this.value;
	};
	Expression.prototype = {
		update: function() {
			var scope;
			if (this.node) scope = this.node.scope;
			else scope = this.attribute.node.scope;
			var val = this.getValue(scope);
			if (this.value !== val) {
				this.value = val;
				(this.node || this.attribute).invalidate = true;
				console.log('result:', this.pattern, val);
			}
		},
		getValue: function(data) {
			return getValue(data, this.path, this.accessor, this.params, this.isFunction);
		}
	};

	function getValue(data, path, accessor, params, isFunction) {
		var pathParts = path.split('.');
		var path = data;
		if (pathParts[0] !== "") {
			var i = -1, l = pathParts.length;
			while (++i < l) {
				path = path[pathParts[i]];
			}
		}
		if (!path) return undefined;
		if (!isFunction) {
			return path[accessor];
		}
		else {
			var args = [];
			var i = -1, l = params.length;
			while (++i < l) {
				var p = params[i];
				if (p.match(regex.findQuote)) {
					args.push(p.replace(regex.findQuote, ''));
				}
				else {
					var exp = new Expression(p);
					args.push(exp.getValue(data));
				}
			}
			return path[accessor].apply(null, args);
		}
		return undefined;
	}

	function isExpFunction(value) {
		return !!value.match(regex.findFunction);
	}

	function getExpressionPath(value) {
		var val = value.split('(')[0];
		return val.substr(0, val.lastIndexOf("."));
	}

	function getExpressionAccessor(value) {
		var val = value.split('(')[0];
		return val.substring(val.lastIndexOf(".")).replace('.', '');
	}

	function getParamsFromString(value) {
		return value.split(regex.findParams);
	}

	function compile(element, nodeList) {
		if (!isElementValid(element)) return;
		console.log('> compile', element);
		// get node
		var node = getNodeFromElement(element);
		nodeList.push(node);
		// children
		if (node.skip) return;
		var child = element.firstChild;
		while (child) {
			compile(child, nodeList);
			child = child.nextSibling;
		}
	}

	function getNodeFromElement(element) {
		var node = new Node(element);
		var attributes = [];
		var skip;
		var repeater;
		for (var attr, name, value, attrs = element.attributes, j = 0, jj = attrs && attrs.length; j < jj; j++) {
			attr = attrs[j];
			if (attr.specified) {
				name = attr.name;
				value = attr.value;
				if (name === settings.attributes.skip) {
					node.skip = (value === "" || value === "true");
				}
				if (name === settings.attributes.repeat) {
					repeater = value;
				}
				if (hasInterpolation(name + ':' + value)) {
					attributes.push(new Attribute(name, value, node));
				}
			}
		}
		node.attributes = attributes;
		return node;
	}

//	function getNodeInstance(element) {
//		var NodeType = Node;
//		var attributeValue;
//		if (element.nodeType === 1)  {
//			var skip = element.getAttribute('data-skip');
//
//			if (attributeValue = element.getAttribute('data-skip') && attributeValue) {
//
//			}
//			console.log('--> node type:', );
//		}
//		return new Node(element);
//	}

	function hasInterpolation(value) {
		var matches = value.match(regex.token);
		return matches && matches.length > 0;
	}

	function isElementValid(element) {
		var type = element.nodeType;
		if (!element || !type) return false;
		// comment
		if (type === 8) return false;
		// empty text node
		var hasContent = regex.findContent.test(element.nodeValue);
		if (type === 3 && !hasContent) return false;
		// result
		return true;
	}

	// render

	function updateScopes(scope, nodeList) {
		console.log('> update scopes');
		var i = -1, l = nodeList.length;
		while(++i < l) {
			nodeList[i].scope = scope;
		}
	}

	function updateExpressions(expressions) {
		console.log('> update expressions');
		var i = -1, l = expressions.length;
		while(++i < l) {
			expressions[i].update();
		}
	}

	function render(nodeList) {
		console.log('> render nodes');
		var i = -1, l = nodeList.length;
		while(++i < l) {
			nodeList[i].render();
		}
	}

	// template

	var Template = function(element) {
		this.element = element;
		this.scope = new Scope();
		this.nodeList = [];
		this.expressions = [];
		this.compile();
	};
	Template.prototype = {
		compile: function() {
			console.log('--- COMPILE ---');
			this.nodeList.length = 0;
			compile(this.element, this.nodeList);
			this.expressions = getExpressionsFromNodes(this.nodeList);
		},
		render: function(data) {
			console.log('--- RENDER ---');
			if (isDefined(data)) this.scope = new Scope(data);
			updateScopes(this.scope, this.nodeList);
			updateExpressions(this.expressions);
			render(this.nodeList);
		}
	};

	function getExpressionsFromNodes(nodeList) {
		var exp = [];
		var i = -1, l = nodeList.length;
		while (++i < l) {
			var node = nodeList[i];
			exp = exp.concat(node.getExpressions());
		}
		return exp;
	}

	var templates = new HashMap();

	function createTemplate(element) {
		var template = new Template(element);
		templates.put(element, template);
		return template;
	}

	// exports
	soma.template.create = createTemplate;

})(this['soma'] = this['soma'] || {});