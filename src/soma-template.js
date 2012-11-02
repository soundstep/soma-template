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
		findWhitespace: /\s+/g,
		sequence: new RegExp(tokens.start + ".+?" + tokens.end + "|[^" + tokens.start + "]+", "g") //    \{\{.+?\}\}|[^{]+|\{(?!\{)
		// todo: need to escape the tokens when the user is settings them
		// todo: info about the sequence regex: \{\{.+?\}\}|[^{]+|\{(?!\{)
		// todo: need the last option: \{(?!\{) in case the tokens.start is at least 2 characters, for 1 character only the first options are enough
		// this means substr the tokens, need to that on unescaped tokens

	};
	var attributes = settings.attributes = {
		skip:"data-skip",
		repeat:"data-repeat",
		src:"data-src",
		href:"data-href",
		show:"data-show",
		hide:"data-hide",
		cloak:"data-cloak"
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
	function escapeRegExp(str) {
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
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
				var regexp = new RegExp("(^|\\s)" + className + "(\\s|$)", "g");
				elm.className = elm.className.replace(regexp, "$2");
			}
		}
		removeClass(elm, className);
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

	// compile

	var c = 0;

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
		this.template = null;

		if (this.isTextNode()) {
			this.value = element.nodeValue;
			this.interpolation = new Interpolation(this.value, this);
		}

	};
	Node.prototype = {
		isTextNode: function() {
			return this.element.nodeType === 3;
		},
		update: function() {
			if (this.parent && templates.get(this.element)) return;
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
			if (this.parent && templates.get(this.element)) return;
			var i = -1, l = this.children.length;
			while (++i < l) {
				this.children[i].update();
			}
		},
		invalidateData: function() {
			if (this.parent && templates.get(this.element)) return;
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
			if (this.parent && templates.get(this.element)) return;
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
			if (this.parent && templates.get(this.element)) return;
			var i = -1, l = this.children.length;
			while (++i < l) {
				this.children[i].render();
			}
		},
		renderRepeater: function() {
//			if (this.repeater) this.element.removeAttribute(attributes.repeat);
			renderRepeater(this);
			if (this.element.parentNode) {
				this.element.parentNode.removeChild(this.element);
			}
		}
	};

	function renderRepeater(node) {
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
						newNode.template = node.template;
						node.childrenRepeater[i] = newNode;
						updateScopeWithRepeaterData(node.repeater, newNode.scope, data[i]);
						newNode.scope['$index'] = i;
						compile(node.template, newElement, node.parent, node.repeater, newNode);
						newNode.update();
						newNode.render();
						if (!previousElement) {
							if (node.previousSibling && node.previousSibling.parentNode) insertAfter(node.previousSibling, newElement);
							else if (node.nextSibling && node.nextSibling.parentNode) insertBefore(node.nextSibling, newElement);
							else node.parent.element.appendChild(newElement);
						}
						else insertAfter(previousElement, newElement);
						previousElement = newNode.element;
					}
					else {
						// existing node
						updateScopeWithRepeaterData(node.repeater, existingChild.scope, data[i]);
						existingChild.scope['$index'] = i;
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
					newNode.template = node.template;
					node.childrenRepeater[count] = newNode;
					updateScopeWithRepeaterData(node.repeater, newNode.scope, data[o]);
					newNode.scope['$key'] = o;
					compile(node.template, newElement, node.parent, node.repeater, newNode);
					newNode.update();
					newNode.render();
					if (!previousElement) {
						if (node.previousSibling && node.previousSibling.parentNode) insertAfter(node.previousSibling, newElement);
						else if (node.nextSibling && node.nextSibling.parentNode) insertBefore(node.nextSibling, newElement);
						else node.parent.element.appendChild(newElement);
					}
					else insertAfter(previousElement, newElement);
					previousElement = newNode.element;
				}
				else {
					// existing node
					updateScopeWithRepeaterData(node.repeater, existingChild.scope, data[o]);
					existingChild.scope['$key'] = o;
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
	}

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
	}

	var Interpolation = function(value, node, attribute) {
		this.value = node && !node.isTextNode() ? trim(value) : value;
		this.node = node;
		this.attribute = attribute;
		this.sequence = [];
		this.expressions = [];
		// find parts
		var val = this.value;
		var parts = val.match(regex.sequence);
		if (parts) {
			var i = -1;
			var l = parts.length;
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
		this.pattern = pattern;
		this.node = node;
		this.attribute = attribute;
		this.isFunction = isExpFunction(this.pattern);
		this.path = getExpressionPath(this.pattern);
		this.accessor = getExpressionAccessor(this.pattern);
		this.params = !this.isFunction ? null : getParamsFromString(this.pattern.match(regex.findFunction)[2]);
		this.value;
		this.watchers = [];
	};
	Expression.prototype = {
		update: function() {
			var node = this.node || this.attribute.node;
			var scope = node.scope;
			var watchers = node.template.watchers;
			var val = this.getValue(scope);
			if (watchers[this.pattern] && typeof watchers[this.pattern] === 'function') {
				var watcherValue = watchers[this.pattern](this.value, val, scope, node, this.attribute);
				if (isDefined(watcherValue)) {
					val = watcherValue;
				}
			}
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

	function getValue(data, pathString, accessor, paramString, isFunc, params) {
		var pathParts = pathString.split('.');
		var path = data;
		if (pathParts[0] !== "") {
			var i = -1, l = pathParts.length;
			while (++i < l) {
				if (!path) {
					if (data._parent) return getValue(data._parent, pathString, accessor, paramString, isFunc, params);
					else return undefined;
				}
				path = path[pathParts[i]];
			}
		}
		if (!path) {
			if (data._parent) return getValue(data._parent, pathString, accessor, paramString, isFunc, params);
			else return undefined;
		}
		if (!isFunc) {
			return path[accessor];
		}
		else {
			var args = [];
			if (paramString) {
				if (params) args = params;
				else {
					var i = -1, l = paramString.length;
					while (++i < l) {
						var p = paramString[i];
						if (p.match(regex.findQuote)) {
							args.push(p.replace(regex.findQuote, ''));
						}
						else {
							var exp = new Expression(p);
							args.push(exp.getValue(data));
						}
					}
				}
			}
			if (!isFunction(path[accessor])) {
				if (data._parent) return getValue(data._parent, pathString, accessor, paramString, isFunc, args);
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

	function isElementValid(element) {
		if (!element) return;
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

	function compile(template, element, parent, repeaterDescendant, nodeTarget) {
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
		node.template = template;
		// children
		if (node.skip) return;
		var child = element.firstChild;
		while (child) {
			var childNode = compile(template, child, node, node.repeater);
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
		this.watchers = {};
		this.element = element;
		this.compile();
	};
	Template.prototype = {
		compile: function() {
			this.node = compile(this, this.element);
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
		watch: function(pattern, watcher) {
			if (!isString(pattern)) return;
			this.watchers[pattern] = watcher;
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
		if (!isElement(element)) return;
		var template = new Template(element);
		templates.put(element, template);
		return template;
	}
	var c = 0;
	function renderAllTemplates() {
		for (var key in templates.getData()) {
			templates.get(key).render();
		}
	}

	// exports
	soma.template.create = createTemplate;
	soma.template.renderAll = renderAllTemplates;

})(this['soma'] = this['soma'] || {});