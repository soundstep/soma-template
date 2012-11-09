;(function (soma, undefined) {

	'use strict';

soma.template = soma.source || {};
soma.template.version = "0.0.1";

var errors = soma.template.errors = {
	TEMPLATE_STRING_NO_ELEMENT: "Error in soma.template, a string template requirement a second parameter: an element target - soma.template.create('string', element)",
	TEMPLATE_NO_PARAM: "Error in soma.template, a template requires at least 1 parameter - soma.template.create(element)",
	REPEAT_WRONG_ARGUMENTS: "Error in soma.template, repeat attribute requires this syntax: 'item in items'."
};

var tokenStart = '{{';
var tokenEnd = '}}';

var settings = soma.template.settings = soma.template.settings || {};

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
	cloak: "data-cloak"
};

var vars = settings.vars = {
	index: "$index",
	key: "$key"
};

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
	depth: /..\//g
};

function isArray(value) {
	return Object.prototype.toString.apply(value) === '[object Array]';
};
function isObject(value) {
	return typeof value === 'object';
}
function isString(value) {
	return typeof value === 'string';
}
function isElement(value) {
	return value ? value.nodeType > 0 : false;
};
function isTextNode(el) {
	return el && el.nodeType && el.nodeType === 3;
}
function isFunction(value) {
	return value && typeof value === 'function';
}
function isDefined(value) {
	return value !== null && value !== undefined;
}
function isExpression(value) {
	return value && isFunction(value.toString) && value.toString() === '[object Expression]';
}
function isNode(value) {
	return value && isFunction(value.toString) && value.toString() === '[object Node]';
}
function isExpFunction(value) {
	if (!isString(value)) return false;
	return !!value.match(regex.func);
}
function childNodeIsTemplate(node) {
	if (!node || !isElement(node.element)) return false;
	if (node.parent && templates.get(node.element)) return true;
	return false;
}
function escapeRegExp(str) {
	return str.replace(regex.escape, "\\$&");
}
function setRegEX(nonEscapedValue, isStartToken) {
	// sequence: \{\{.+?\}\}|[^{]+|\{(?!\{)[^{]*
	var unescapedCurrentStartToken = tokens.start().replace(/\\/g, '');
	var endSequence = "";
	var ts = isStartToken ? nonEscapedValue : unescapedCurrentStartToken;
	if (ts.length > 1) {
		endSequence = "|\\" + ts.substr(0, 1) + "(?!\\" + ts.substr(1, 1) + ")[^" + ts.substr(0, 1) + "]*";
	}
	regex.sequence = new RegExp(tokens.start() + ".+?" + tokens.end() + "|[^" + tokens.start() + "]+" + endSequence, "g");
	regex.token = new RegExp(tokens.start() + ".*?" + tokens.end(), "g");
	regex.expression = new RegExp(tokens.start() + "|" + tokens.end(), "gm");
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
function trimScopeDepth(value) {
	return value.replace(regex.depth, '');
}
function insertBefore(referenceNode, newNode) {
	if (!referenceNode.parentNode) return;
	referenceNode.parentNode.insertBefore(newNode, referenceNode);
}
function insertAfter(referenceNode, newNode) {
	if (!referenceNode.parentNode) return;
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
function removeClass(elm, className) {
	if (document.documentElement.classList) {
		removeClass = function (elm, className) {
			elm.classList.remove(className);
		}
	} else {
		removeClass = function (elm, className) {
			if (!elm || !elm.className) {
				return false;
			}
			var reg = new RegExp("(^|\\s)" + className + "(\\s|$)", "g");
			elm.className = elm.className.replace(reg, "$2");
		}
	}
	removeClass(elm, className);
}
function HashMap(){
	var uuid = function(a,b){for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');return b;}
	var data = {};
	var getKey = function(target) {
		if (!target) return;
		if (typeof target !== 'object') return target;
		var result;
		try {
			// IE 7-8 needs a try catch, seems like I can't add a property on text nodes
			result = target.hashkey ? target.hashkey : target.hashkey = uuid();
		} catch(err){};
		return result;
	}
	return {
		put: function(key, value) {
			data[getKey(key)] = value;
		},
		get: function(key) {
			return data[getKey(key)];
		},
		remove: function(key) {
			delete data[getKey(key)];
		},
		getData: function() {
			return data;
		},
		dispose: function() {
			for (var k in data) {
				data[k] = null;
				delete data[k];
			}
		}
	}
}



function getRepeaterData(repeaterValue, scope) {
	var parts = repeaterValue.match(regex.repeat);
	if (!parts) return;
	var source = parts[2];
	var exp = new Expression(source);
	return exp.getValue(scope);
}

function updateScopeWithRepeaterData(repeaterValue, scope, data) {
	var parts = repeaterValue.match(regex.repeat);
	if (!parts) return;
	var name = parts[1];
	scope[name] = data;
}
function getWatcherValue(exp, newValue) {
	var node = exp.node || exp.attribute.node;
	var watchers = node.template.watchers;
	var nodeTarget = node.element;
	if (!watchers) return newValue;
	var watcherNode = watchers.get(nodeTarget);
	if (!watcherNode && isTextNode(node.element) && node.parent) watcherNode = watchers.get(node.parent.element);
	var watcher = watcherNode ? watcherNode : watchers.get(exp.pattern);
	if (isFunction(watcher)) {
		var watcherValue = watcher(exp.value, newValue, exp.pattern, node.scope, node, exp.attribute);
		if (isDefined(watcherValue)) {
			return watcherValue;
		}
	}
	return newValue;
}

function getScopeFromPattern(scope, pattern) {
	var depth = getScopeDepth(pattern);
	var scopeTarget = scope;
	while (depth > 0) {
		scopeTarget = scopeTarget._parent ? scopeTarget._parent : scopeTarget;
		depth--;
	}
	return scopeTarget;
}

function getParameterValue(scope, pattern) {
	if (pattern.match(regex.quote)) {
		return pattern.replace(regex.quote, '');
	}
	var scopeTarget = getScopeFromPattern(scope, pattern);
	var exp = new Expression(pattern);
	var pathParts = exp.path.split('.');
	var path = scopeTarget;
	if (pathParts[0] !== "") {
		var i = -1, l = pathParts.length;
		while (++i < l) {
			if (!path) {
				if (scopeTarget._parent) return getParameterValue(scopeTarget._parent, pattern);
				else return undefined;
			}
			path = path[pathParts[i]];
		}
	}
	if ( (!isDefined(path) || !isDefined(path[exp.accessor])) && scopeTarget._parent) {
		// no path found, search in parent
		return getParameterValue(scopeTarget._parent, pattern);
	}
	return path[exp.accessor];
}

function getValue(scope, pattern, pathString, accessor, params, isFunc, paramsFound) {
	// find params
	var paramsValues = [];
	if (!paramsFound && params) {
		var j = -1, jl = params.length;
		while (++j < jl) {
			paramsValues.push(getParameterValue(scope, params[j]));
		}
	}
	else paramsValues = paramsFound;
	// find accessor
	var scopeTarget = getScopeFromPattern(scope, pattern);
	var pathParts = pathString.split('.');
	var path = scopeTarget;
	// search path
	if (pathParts[0] !== "") {
		var i = -1, l = pathParts.length;
		while (++i < l) {
			if (!path) {
				if (scopeTarget._parent) return getValue(scopeTarget._parent, pattern, pathString, accessor, params, isFunc, paramsValues);
				else return undefined;
			}
			path = path[pathParts[i]];
		}
	}
	if (!isFunc && path) {
		// not a function
		if (!isDefined(path[accessor]) && scopeTarget._parent) return getValue(scopeTarget._parent, pattern, pathString, accessor, params, isFunc, paramsValues);
		else return path[accessor];
	}
	else {
		if ( (!isDefined(path) || !isDefined(path[accessor])) && scopeTarget._parent) {
			// no path found, search in parent
			return getValue(scopeTarget._parent, pattern, pathString, accessor, params, isFunc, paramsValues);
		}
		if (!isFunction(path[accessor])) {
			// not a function
			if (scopeTarget._parent) return getValue(scopeTarget._parent, pattern, pathString, accessor, params, isFunc, paramsValues);
			else return undefined;
		}
		// found path and params
		return path[accessor].apply(null, paramsValues);
	}
	return undefined;
}

function getExpressionPath(value) {
	var val = value.split('(')[0];
	val = trimScopeDepth(val);
	return val.substr(0, val.lastIndexOf("."));
}

function getExpressionAccessor(value) {
	var val = value.split('(')[0];
	val = trimScopeDepth(val);
	return val.substring(val.lastIndexOf(".")).replace('.', '');
}

function getParamsFromString(value) {
	return trimArray(value.split(regex.params));
}

function getScopeDepth(value) {
	var val = value.split('(')[0];
	var matches = val.match(regex.depth);
	return !matches ? 0 : matches.length;
}

function getNodeFromElement(element, scope, isRepeaterDescendant) {
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
			if (!isRepeaterDescendant && name === settings.attributes.repeat) {
				node.repeater = value;
			}
			if (
				hasInterpolation(name + ':' + value) ||
					name === settings.attributes.repeat ||
					name === settings.attributes.show ||
					name === settings.attributes.hide ||
					name === settings.attributes.href ||
					value.indexOf(settings.attributes.cloak) !== -1
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

function hasContent(value) {
	return regex.content.test(value)
}

function isElementValid(element) {
	if (!element) return;
	var type = element.nodeType;
	if (!element || !type) return false;
	// comment
	if (type === 8) return false;
	// empty text node
	if (type === 3 && !hasContent(element.nodeValue) && !hasInterpolation(element.nodeValue)) return false;
	// result
	return true;
}

function compile(template, element, parent, nodeTarget) {
	if (!isElementValid(element)) return;
	// get node
	var node;
	if (!nodeTarget) {
		node = getNodeFromElement(element, parent ? parent.scope : new Scope());
	}
	else {
		node = nodeTarget;
		node.parent = parent;
	}
	node.template = template;
	// children
	if (node.skip) return;
	var child = element.firstChild;
	while (child) {
		var childNode = compile(template, child, node);
		if (childNode) {
			childNode.parent = node;
			node.children.push(childNode);
		}
		child = child.nextSibling;
	}
	return node;
}

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

function updateNodeChildren(node) {
	if (childNodeIsTemplate(node) || node.repeater || !node.children) return;
	var i = -1, l = node.children.length;
	while (++i < l) {
		node.children[i].update();
	}
}

function renderNodeChildren(node) {
	if (childNodeIsTemplate(node) || !node.children) return;
	var i = -1, l = node.children.length;
	while (++i < l) {
		node.children[i].render();
	}
}

function renderNodeRepeater(node) {
	var data = getRepeaterData(node.repeater, node.scope);
	if (isArray(data)) {
		var i = -1;
		var l1 = data.length;
		var l2 = node.childrenRepeater.length;
		var l = l1 > l2 ? l1 : l2;
		while (++i < l) {
			if (i < l1) {
				var previousElement;
				var existingChild = node.childrenRepeater[i];
				if (!existingChild) {
					// no existing node
					var newElement = node.element.cloneNode(true);
					var newNode = getNodeFromElement(newElement, node.scope._createChild(), true);
					newNode.parent = node;
					newNode.template = node.template;
					node.childrenRepeater[i] = newNode;
					updateScopeWithRepeaterData(node.repeater, newNode.scope, data[i]);
					newNode.scope[vars.index] = i;
					compile(node.template, newElement, node.parent, newNode);
					newNode.update();
					newNode.render();
					if (!previousElement) {
						if (node.previousSibling) {
							insertAfter(node.previousSibling, newElement);
						}
						else if (node.nextSibling) {
							insertBefore(node.nextSibling, newElement);
						}
						else {
							node.parent.element.appendChild(newElement);
						}
					}
					else {
						insertAfter(previousElement, newElement);
					}
					previousElement = newNode.element;
				}
				else {
					// existing node
					updateScopeWithRepeaterData(node.repeater, existingChild.scope, data[i]);
					existingChild.scope[vars.index] = i;
					existingChild.update();
					existingChild.render();
					previousElement = existingChild.element;
				}
			}
			else {
				// todo: dispose node
				node.parent.element.removeChild(node.childrenRepeater[i].element);
			}
		}
		if (node.childrenRepeater.length > data.length) node.childrenRepeater.length = data.length;
	}
	else {
		var count = -1;
		for (var o in data) {
			count++;
			var previousElement;
			var existingChild = node.childrenRepeater[count];
			if (!existingChild) {
				// no existing node
				var newElement = node.element.cloneNode(true);
				var newNode = getNodeFromElement(newElement, node.scope._createChild(), true);
				newNode.parent = node.parent;
				newNode.template = node.template;
				node.childrenRepeater[count] = newNode;
				updateScopeWithRepeaterData(node.repeater, newNode.scope, data[o]);
				newNode.scope[vars.key] = o;
				compile(node.template, newElement, node.parent, newNode);
				newNode.update();
				newNode.render();
				if (!previousElement) {
					if (node.previousSibling) insertAfter(node.previousSibling, newElement);
					else if (node.nextSibling) insertBefore(node.nextSibling, newElement);
					else node.parent.element.appendChild(newElement);
				}
				else insertAfter(previousElement, newElement);
				previousElement = newNode.element;
			}
			else {
				// existing node
				updateScopeWithRepeaterData(node.repeater, existingChild.scope, data[o]);
				existingChild.scope[vars.key] = o;
				existingChild.update();
				existingChild.render();
				previousElement = existingChild.element;
			}
		}
		var size = count;
		while (count++ < node.childrenRepeater.length-1) {
			// todo: dispose node
			node.parent.element.removeChild(node.childrenRepeater[count].element);
		}
		node.childrenRepeater.length = size+1;
	}
	if (node.element.parentNode) {
		node.element.parentNode.removeChild(node.element);
	}
}

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
			_createChild: function(data) {
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

var Node = function(element, scope) {
	this.element = element;
	this.scope = scope;
	this.attributes = null;
	this.value = null;
	this.interpolation = null;
	this.invalidate = false;
	this.skip = false;
	this.repeater = null;
	this.parent = null;
	this.children = [];
	this.childrenRepeater = [];
	this.previousSibling = null;
	this.nextSibling = null;
	this.template = null;

	if (isTextNode(this.element)) {
		this.value = this.element.nodeValue;
		this.interpolation = new Interpolation(this.value, this);
	}

};
Node.prototype = {
	toString: function() {
		return '[object Node]';
	},
	dispose: function() {
		var i, l;
		if (this.children) {
			i = -1; l = this.children.length;
			while (++i < l) {
				this.children[i].dispose();
			}
		}
		if (this.childrenRepeater) {
			i = 0; l = this.childrenRepeater.length;
			while (++i < l) {
				this.childrenRepeater[i].dispose();
			}
		}
		if (this.attributes) {
			i = 0; l = this.attributes.length;
			while (++i < l) {
				this.attributes[i].dispose();
			}
		}
		if (this.interpolation) {
			this.interpolation.dispose();
		}
		this.element = null;
		this.scope = null;
		this.attributes = null;
		this.value = null;
		this.interpolation = null;
		this.repeater = null;
		this.parent = null;
		this.children = null;
		this.childrenRepeater = null;
		this.previousSibling = null;
		this.nextSibling = null;
		this.template = null;
	},
	getNode: function(element) {
		var node;
		if (element === this.element) return this;
		else if (this.childrenRepeater.length > 0) {
			var k = -1, kl = this.childrenRepeater.length;
			while (++k < kl) {
				node = this.childrenRepeater[k].getNode(element);

				if (node) return node;
			}
		}
		else {
			var i = -1, l = this.children.length;
			while (++i < l) {
				node = this.children[i].getNode(element);
				if (node) return node;
			}
		}
		return null;
	},
	update: function() {
		if (childNodeIsTemplate(this)) return;
		if (isDefined(this.interpolation)) {
			this.interpolation.update();
		}
		if (isDefined(this.attributes)) {
			var i = -1, l = this.attributes.length;
			while (++i < l) {
				this.attributes[i].update();
			}
		}
		updateNodeChildren(this);
	},
	invalidateData: function() {
		if (childNodeIsTemplate(this)) return;
		this.invalidate = true;
		var i, l;
		if (this.attributes) {
			i = -1
			l = this.attributes.length;
			while (++i < l) {
				this.attributes[i].invalidate = true;
			}
		}
		i = -1;
		l = this.childrenRepeater.length;
		while (++i < l) {
			this.childrenRepeater[i].invalidateData();
		}
		i = -1;
		l = this.children.length;
		while (++i < l) {
			this.children[i].invalidateData();
		}
	},
	render: function() {
		if (childNodeIsTemplate(this)) return;
		if (this.invalidate) {
			this.invalidate = false;
			if (isTextNode(this.element)) {
				this.value = this.element.nodeValue = this.interpolation.render();
			}
		}
		if (this.attributes) {
			var i = -1, l = this.attributes.length;
			while (++i < l) {
				this.attributes[i].render();
			}
		}
		if (this.repeater) {
			renderNodeRepeater(this);
		}
		else {
			renderNodeChildren(this);
		}
	}
};
var Attribute = function(name, value, node, data) {
	this.name = name;
	this.value = value;
	this.node = node;
	this.interpolationName = new Interpolation(this.name, null, this);
	this.interpolationValue = new Interpolation(this.value, null, this);
	this.invalidate = false;
};
Attribute.prototype = {
	toString: function() {
		return '[object Attribute]';
	},
	dispose: function() {
		if (this.interpolationName) this.interpolationName.dispose();
		if (this.interpolationValue) this.interpolationValue.dispose();
		this.interpolationName = null;
		this.interpolationValue = null;
		this.name = null;
		this.value = null;
		this.node = null;
	},
	update: function() {
		this.interpolationName.update();
		this.interpolationValue.update();
	},
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
				this.node.element.removeAttribute(this.interpolationName.value);
				renderAttribute(this.name, this.value);
			}
		}
		// cloak
		if (this.name === 'class' && this.value.indexOf(settings.attributes.cloak) !== -1) {
			removeClass(this.node.element, settings.attributes.cloak);
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
};

var Interpolation = function(value, node, attribute) {
	this.value = node && !isTextNode(node.element) ? trim(value) : value;
	this.node = node;
	this.attribute = attribute;
	this.sequence = [];
	this.expressions = [];
	var parts = this.value.match(regex.sequence);
	if (parts) {
		var i = -1, l = parts.length;
		while (++i < l) {
			if (parts[i].match(regex.token)) {
				var exp = new Expression(trimTokens(parts[i]), this.node, this.attribute);
				this.sequence.push(exp);
				this.expressions.push(exp);
			}
			else {
				this.sequence.push(parts[i]);
			}
		}
		trimArray(this.sequence);
	}
};
Interpolation.prototype = {
	toString: function() {
		return '[object Interpolation]';
	},
	dispose: function() {
		if (this.expressions) {
			var i = -1, l = this.expressions.length;
			while (++i < l) {
				this.expressions[i].dispose();
			}
		}
		this.value = null;
		this.node = null;
		this.attribute = null;
		this.sequence = null;
		this.expressions = null;
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
				var val = "";
				if (isExpression(this.sequence[i])) val = this.sequence[i].value;
				else val = this.sequence[i];
				if (!isDefined(val)) val = "";
				rendered += val;
			}
		}
		return rendered;
	}
};

var Expression = function(pattern, node, attribute) {
	if (!isDefined(pattern)) return;
	this.pattern = pattern;
	this.depth = getScopeDepth(this.pattern);
	this.node = node;
	this.attribute = attribute;
	this.isFunction = isExpFunction(this.pattern);
	this.path = getExpressionPath(this.pattern);
	this.accessor = getExpressionAccessor(this.pattern);
	this.params = !this.isFunction ? null : getParamsFromString(this.pattern.match(regex.func)[2]);
	this.value;
};
Expression.prototype = {
	toString: function() {
		return '[object Expression]';
	},
	dispose: function() {
		this.pattern = null;
		this.node = null;
		this.attribute = null;
		this.path = null;
		this.accessor = null;
		this.params = null;
		this.value = null;
	},
	update: function() {
		var node = this.node;
		if (!node && this.attribute) node = this.attribute.node;
		if (!node && node.scope) return;
		var newValue = this.getValue(node.scope);
		newValue = getWatcherValue(this, newValue);
		if (this.value !== newValue) {
			this.value = newValue;
			(this.node || this.attribute).invalidate = true;
		}
	},
	getValue: function(scope) {
		return getValue(scope, this.pattern, this.path, this.accessor, this.params, this.isFunction);
	}
};

var templates = new HashMap();

var Template = function(element) {
	this.watchers = new HashMap();
	this.node = null;
	this.scope = null;
	this.compile(element);
};
Template.prototype = {
	toString: function() {
		return '[object Template]';
	},
	compile: function(element) {
		if (element) this.element = element;
		if (this.node) this.node.dispose();
		this.node = compile(this, this.element);
		this.node.root = true;
		this.scope = this.node.scope;
	},
	update: function(data) {
		if (isDefined(data)) updateScopeWithData(this.node.scope, data);
		if (this.node) this.node.update();
	},
	render: function(data) {
		this.update(data);
		if (this.node) this.node.render();
	},
	invalidate: function() {
		if (this.node) this.node.invalidateData();
	},
	watch: function(target, watcher) {
		if ( (!isString(target) && !isElement(target)) || !isFunction(watcher)) return;
		this.watchers.put(target, watcher);
	},
	unwatch: function(target) {
		this.watchers.remove(target);
	},
	clearWatchers: function() {
		this.watchers.dispose();
	},
	getNode: function(element) {
		return this.node.getNode(element);
	},
	dispose: function() {
		templates.remove(this.element);
		if (this.watchers) {
			this.watchers.dispose();
		}
		if (this.node) {
			this.node.dispose();
		}
		this.element = null;
		this.watchers = null;
		this.node = null;
	}
};

function createTemplate(source, target) {
	var element;
	if (isString(source)) {
		// string template
		if (!isElement(target)) {
			throw new Error(soma.template.errors.TEMPLATE_STRING_NO_ELEMENT);
		}
		target.innerHTML = source;
		element = target;
	}
	else if (isElement(source)) {
		if (isElement(target)) {
			// element template with target
			target.innerHTML = source.innerHTML;
			element = target;
		}
		else {
			// element template
			element = source;
		}
	}
	else {
		throw new Error(soma.template.errors.TEMPLATE_NO_PARAM);
	}
	// existing template
	if (getTemplate(element)) {
		getTemplate(element).dispose();
	}
	// create template
	var template = new Template(element);
	templates.put(element, template);
	return template;
}

function getTemplate(element) {
	if (!isElement(element)) return null;
	return templates.get(element);
}

function renderAllTemplates() {
	for (var key in templates.getData()) {
		templates.get(key).render();
	}
}

// set regex
tokens.start(tokenStart);
tokens.end(tokenEnd);

// exports
soma.template.create = createTemplate;
soma.template.get = getTemplate;
soma.template.renderAll = renderAllTemplates;

})(this['soma'] = this['soma'] || {});