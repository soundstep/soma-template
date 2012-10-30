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
		findContent: /[^.|^\s]/gm,
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
	function insertBefore(referenceNode, newNode) {
		referenceNode.parentNode.insertBefore(newNode, referenceNode);
	}
	function insertAfter(referenceNode, newNode) {
		referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
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
	function isDate(value){
		return toString.apply(value) == '[object Date]';
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
		function createChild(data) {
			var obj = createObject(data);
			obj._parent = this;
			this._children.push(obj);
			return obj;
		}
		function createObject(data) {
			var obj = {
				_parent: null,
				_children: [],
				_createChild: function() {
					return createChild.apply(obj, arguments);
				}
			};
			if (data && isObject(data)) {
				for (var i in data) {
					obj[i] = data[i];
				}
			}
			return obj;
		}
		return createObject(data);
	};

	// compile

	var Node = function(element, scope) {
		this.element = element;
		this.scope = scope;
		this.attributes = null;
		this.value = null;
		this.interpolation = null;
		this.invalidate = false;
		this.skip = false;
		this.repeater = null;
		this.repeaterDescendant = null;
		this.parent = null;
		this.children = [];
		this.childrenRepeater = [];
		this.previousSibling = null;
		this.nextSibling = null;

		if (this.isTextNode()) {
			this.value = element.nodeValue;
			this.interpolation = new Interpolation(this.value, this);
		}

	};
	Node.prototype = {
		isTextNode: function() {
			return this.element.nodeType === 3;
		},
		getExpressionsString: function() {
			var str = "";
			if (isDefined(this.interpolation)) {
				str += this.interpolation.getExpressionsString();
			}
			if (isDefined(this.attributes)) {
				var i = -1, l = this.attributes.length;
				while (++i < l) {
					str += this.attributes[i].interpolationName.getExpressionsString();
					str += this.attributes[i].interpolationValue.getExpressionsString();
				}
			}
			str += this.getChildrenExpressionsString();
			return str;
		},
		getChildrenExpressionsString: function() {
			var str = "";
			var i = -1, l = this.children.length;
			while (++i < l) {
				str += this.children[i].getExpressionsString();
			}
			return str;
		},
		update: function() {
			if (isDefined(this.interpolation)) {
				this.interpolation.update();
			}
			if (isDefined(this.attributes)) {
				var i = -1, l = this.attributes.length;
				while (++i < l) {
					this.attributes[i].interpolationName.update();
					this.attributes[i].interpolationValue.update();
				}
			}
			if (this.repeater) return;
			this.updateChildren();
		},
		updateChildren: function() {
			var i = -1, l = this.children.length;
			while (++i < l) {
				this.children[i].update();
			}
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
			if (this.repeater) {
				this.renderRepeater();
			}
			else {
				this.renderChildren();
			}
		},
		renderChildren: function() {
			var i = -1, l = this.children.length;
			while (++i < l) {
				this.children[i].render();
			}
		},
		renderRepeater: function() {
			var data = getRepeaterData(this.repeater, this.scope);
			if (isArray(data)) {
				var i = -1, l1 = data.length, l2 = this.childrenRepeater.length;
				var l = l1 > l2 ? l1 : l2;
				while (++i < l) {
					if (i < l1) {
						var previousElement;
						var existingChild = this.childrenRepeater[i];
						if (!existingChild) {
							// no existing node
							var newElement = this.element.cloneNode(true);
							newElement.removeAttribute(attributes.repeat);
							var newNode = getNodeFromElement(newElement, this.scope._createChild());
							this.childrenRepeater[i] = newNode;
							updateScopeWithRepeaterData(this.repeater, newNode.scope, data[i]);
							newNode.scope['$index'] = i;
							compile(newElement, this.parent, this.repeater, newNode);
							newNode.update();
							newNode.render();
							if (!previousElement) {
								if (this.previousSibling) insertAfter(this.previousSibling, newElement);
								else if (this.nextSibling) insertBefore(this.nextSibling, newElement);
								else this.parent.element.appendChild(newElement);
							}
							else insertAfter(previousElement, newElement);
							previousElement = newNode.element;
						}
						else {
							// existing node
							updateScopeWithRepeaterData(this.repeater, existingChild.scope, data[i]);
							existingChild.scope['$index'] = i;
							existingChild.update();
							existingChild.render();
							previousElement = existingChild.element;
						}
					}
					else {
						// todo: dispose node
						this.parent.element.removeChild(this.childrenRepeater[i].element);
					}
				}
				this.childrenRepeater.length = data.length;
			}
			else {
				var count = -1;
				for (var o in data) {
					count++;
					var previousElement;
					var existingChild = this.childrenRepeater[count];
					if (!existingChild) {
						// no existing node
						var newElement = this.element.cloneNode(true);
						newElement.removeAttribute(attributes.repeat);
						var newNode = getNodeFromElement(newElement, this.scope._createChild());
						this.childrenRepeater[count] = newNode;
						updateScopeWithRepeaterData(this.repeater, newNode.scope, data[o]);
						newNode.scope['$key'] = o;
						compile(newElement, this.parent, this.repeater, newNode);
						newNode.update();
						newNode.render();
						if (!previousElement) {
							if (this.previousSibling) insertAfter(this.previousSibling, newElement);
							else if (this.nextSibling) insertBefore(this.nextSibling, newElement);
							else this.parent.element.appendChild(newElement);
						}
						else insertAfter(previousElement, newElement);
						previousElement = newNode.element;
					}
					else {
						// existing node
						updateScopeWithRepeaterData(this.repeater, existingChild.scope, data[o]);
						existingChild.scope['$key'] = o;
						existingChild.update();
						existingChild.render();
						previousElement = existingChild.element;
					}
				}
				var size = count;
				while (count++ < this.childrenRepeater.length-1) {
					// todo: dispose node
					this.parent.element.removeChild(this.childrenRepeater[count].element);
				}
				this.childrenRepeater.length = size+1;
			}
			if (this.element.parentNode) {
				this.parent.element.removeChild(this.element);
			}
		}
	};

	function getRepeaterData(repeaterValue, scope) {
		var parts;
		if (!(parts = repeaterValue.match(regex.repeat))) return;
		var source = parts[2];
		var exp = new Expression(source);
		return exp.getValue(scope);
	}

	function updateScopeWithRepeaterData(repeaterValue, scope, data) {
		var parts;
		if (!(parts = repeaterValue.match(regex.repeat))) return;
		var name = parts[1];
		scope[name] = data;
	}

	var Attribute = function(name, value, node, data) {
		this.name = name;
		this.value = value;
		this.node = node;
		this.interpolationName = new Interpolation(this.name, null, this);
		this.interpolationValue = new Interpolation(this.value, null, this);
		this.invalidate = false;
	};
	Attribute.prototype = {
		render: function() {
			if (this.node.repeater) return;
			var element = this.node.element;
			if (this.invalidate) {
				this.invalidate = false;
				this.name = this.interpolationName.render() || this.name;
				this.value = this.interpolationValue.render() || this.value;
				if (this.name === attributes.src) {
					renderSrc(this.name, this.value);
				}
				else if (this.name === attributes.href) {
					renderHref(this.name, this.value);
				}
				else {
					renderAttribute(this.name, this.value);
				}
			}
			// hide
			if (this.name === attributes.hide) {
				element.style.display = (!isDefined(this.value) || this.value === "" || this.value === true || this.value === "true") ? "none" : "block";
			}
			// show
			if (this.name === attributes.show) {
				element.style.display = (!isDefined(this.value) || this.value === "" || this.value === true || this.value === "true") ? "block" : "none";
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
			// href attribute
			function renderHref(name, value) {
				element.setAttribute('href', value);
			}
		}
	}

	var Interpolation = function(value, node, attribute) {
		this.value = node && !node.isTextNode() ? trim(value) : value;
		this.node = node;
		this.attribute = attribute;
		this.sequence = [];
		this.expressions = [];
		this.expressionsString = "";
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
		getExpressionsString: function() {
			var str = "";
			var i = -1, l = this.expressions.length;
			while (++i < l) {
				str += this.expressions[i].value;
			}
			return str;
		},
		update: function() {
			var i = -1, l = this.expressions.length;
			while (++i < l) {
				this.expressions[i].update();
			}
		},
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
			}
		},
		getValue: function(scope) {
			var value = getValue(scope, this.path, this.accessor, this.params, this.isFunction);
			if (!isDefined(value) && scope._parent) return getValue(scope._parent, this.path, this.accessor, this.params, this.isFunction);
			return value;
		}
	};

	function getValue(data, pathString, accessor, params, isFunc) {
		var pathParts = pathString.split('.');
		var path = data;
		if (pathParts[0] !== "") {
			var i = -1, l = pathParts.length;
			while (++i < l) {
				if (!path) {
					if (data._parent) return getValue(data._parent, pathString, accessor, params, isFunc);
					else return undefined;
				}
				path = path[pathParts[i]];
			}
		}
		if (!path) {
			if (data._parent) return getValue(data._parent, pathString, accessor, params, isFunc);
			else return undefined;
		}
		if (!isFunc) {
			return path[accessor];
		}
		else {
			var args = [];
			if (params) {
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
			}
			if (!isFunction(path[accessor])) {
				if (data._parent) return getValue(data._parent, pathString, accessor, params, isFunc);
				else return undefined;
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

	function getNodeFromElement(element, scope) {
		var node = new Node(element, scope);
		node.previousSibling = element.previousSibling;
		node.nextSibling = element.nextSibling;
		var attributes = [];
		for (var attr, name, value, attrs = element.attributes, j = 0, jj = attrs && attrs.length; j < jj; j++) {
			attr = attrs[j];
			if (attr.specified) {
				name = attr.name;
				value = attr.value;
				if (name === settings.attributes.skip) {
					node.skip = (value === "" || value === "true");
				}
				if (name === settings.attributes.repeat) {
					node.repeater = value;
				}
				if (
					hasInterpolation(name + ':' + value) ||
					name === settings.attributes.repeat ||
					name === settings.attributes.show ||
					name === settings.attributes.hide ||
					name === settings.attributes.href
					) {
					attributes.push(new Attribute(name, value, node));
				}
			}
		}
		node.attributes = attributes;
		return node;
	}

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
		//var hasContent = regex.findContent.test(element.nodeValue);
		if (type === 3 && !hasInterpolation(element.nodeValue)) return false;
		// result
		return true;
	}

	function compile(element, parent, repeaterDescendant, nodeTarget) {
		if (!isElementValid(element)) return;
		// get node
		var node;
		if (!nodeTarget) {
			node = getNodeFromElement(element, parent ? parent.scope : new Scope());
			if (repeaterDescendant) {
				node.repeaterDescendant = repeaterDescendant;
			}
		}
		else {
			node = nodeTarget;
			node.parent = parent;
		}
		// children
		if (node.skip) return;
		var child = element.firstChild;
		while (child) {
			var childNode = compile(child, node, node.repeater);
			if (childNode) {
				childNode.parent = node;
				node.children.push(childNode);
			}
			child = child.nextSibling;
		}
		return node;
	}

	// template

	var Template = function(element) {
		this.element = element;
		this.node;
		this.expressions = [];
		this.compile();
	};
	Template.prototype = {
		compile: function() {
			this.node = compile(this.element);
		},
		render: function(data) {
			if (isDefined(data)) updateScopeWithData(this.node.scope, data);
			this.node.update();
			this.node.render();
		}
	};

	function updateScopeWithData(scope, data) {
		clearScope(scope);
		for (var d in data) {
			scope[d] = data[d];
		}
	}

	function clearScope(scope) {
		for (var key in scope) {
			if (key.substr(0, 1) !== '_') {
				scope[key] = null;
				delete scope[key];
			}
		}
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