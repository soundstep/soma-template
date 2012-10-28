;(function (soma, undefined) {

	'use strict';

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
		return typeof value === 'object' && value.expression !== undefined;
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

	// node

	var Node = function(element, value, attributes, repeater) {
		this.element = element;
		this.value = value;
		this.valueRendered;
		this.attributes = attributes;
		this.sequence = getSequence(value, true);
		this.repeater = repeater;
		this.repeaterData;
		this.repeaterParent;
		this.repeaterNodes = [];
		this.repeaterScopes = [];
	}
	Node.prototype.render = function(data) {
		this.renderValue(data);
		this.renderAttributes(data);
		if (this.repeater) {
			this.renderRepeater(data);
		}
	}
	Node.prototype.renderValue = function(data) {
		if (!this.sequence) return;
		var newValue = renderSequence(this.sequence, data);
		if (newValue !== this.valueRendered) {
			this.element.nodeValue = this.valueRendered = newValue;
		}
	}
	Node.prototype.renderAttributes = function(data) {
		if (!this.attributes) return;
		var i = -1, l = this.attributes.length;
		while (++i < l) {
			this.attributes[i].render(data);
		}
	}
	Node.prototype.skipped = function() {
		if (!this.attributes) return false;
		var i = -1, l = this.attributes.length;
		while (++i < l) {
			if (this.attributes[i].name === attributes.skip) {
				return true;
			}
		}
		return false;
	}
	Node.prototype.renderRepeater = function(data) {
		var matches = this.repeater.match(regex.repeat);
		if (!matches || matches.length !== 3) {
			throw new Error(errors.REPEAT_WRONG_ARGUMENTS);
		}
		else {

			// check
			var itVar = matches[1];
			var itPath = matches[2];
			var exp = new Expression(itPath);
			var itSource = exp.render(data);

			if (isArray(itSource)) {







				
			}


			return;

			console.log(itSource);

			if (equals(this.repeaterData, itSource)) {
				console.log('whole data is the same');
				return;
			}

			// revert node
//			var p = -1;
//			var po = this.repeaterNodes.length;
//			while (++p < po) {
//				var rn = this.repeaterNodes[p];
//				rn.parentNode.removeChild(rn);
//			}
//			this.repeaterNodes.length = 0;
//			// TODO: dispose scopes
//			this.repeaterScopes.length = 0;
//
			if (!this.repeaterParent) {
				this.repeaterParent = this.element.parentNode;
				this.repeaterParent.removeChild(this.element);
			}


			if (isArray(itSource)) {
				this.element.removeAttribute(attributes.repeat);
				var fragment1 = document.createDocumentFragment();
				var newNode;
				var k = -1;
				var kl = itSource.length;
				while (++k < kl) {
					console.log(k, this.repeaterData, itSource);
					if (this.repeaterData && this.repeaterData[k] && equals(itSource[k], this.repeaterData[k])) {
						console.log('item data is the same', k);
						fragment1.appendChild(this.repeaterNodes[k]);
					}
					else {

						var previousChild = this.repeaterNodes[k];
						console.log('previous child', previousChild);
						if (previousChild) {
							this.repeaterParent.removeChild(previousChild);
						}

						console.log('create', k);
						var o1 = {};
						o1[itVar] = itSource[k];

						var scopeChild = data.add(o1, data);

						newNode = this.element.cloneNode(true);
						fragment1.appendChild(newNode);

						compileNodes(newNode, scopeChild.nodeList);
						renderNodes(scopeChild, newNode, scopeChild.nodeList);

						this.repeaterNodes[k] = newNode;

					}


				}
				this.repeaterParent.appendChild(fragment1);

				this.repeaterData = itSource;

			}
			else if (isObject(itSource)) {
//				el.removeAttribute(attributes.repeat);
//				//if (obj[itVar]) throw new Error("BLAH");
//				var fragment2 = document.createDocumentFragment();
//				var newNode;
//				for (var o in itSource) {
//					if (VERBOSE) console.log(o, itVar, itSource);
//
//					var o2 = {};
//					o2[itVar] = itSource;
//					var childObj2 = obj.add(o2, obj);
//
//					if (VERBOSE) console.log('childObj', childObj2);
//
//					newNode = el.cloneNode(true);
//					fragment2.appendChild(newNode);
//					applyTemplate(newNode, childObj2);
//				}
//				el.parentNode.appendChild(fragment2);
//				el.parentNode.removeChild(el);
			}


		}
	}

	var Attribute = function(element, name, value) {
		this.element = element;
		this.name = name;
		this.nameRendered;
		this.value = trim(value);
		this.valueRendered;
		this.nameSequence = getSequence(this.name);
		this.valueSequence = getSequence(this.value);
		this.hasNameChanged = false;
		this.hasValueChanged = false;
		this.previousName;
	}
	Attribute.prototype.render = function(data) {
		this.hasNameChanged = false;
		this.hasValueChanged = false;
		this.renderName(data);
		this.renderValue(data);
		// hide
		if (this.name === attributes.hide) {
			if (this.valueRendered === null || this.valueRendered === undefined || this.valueRendered || this.valueRendered === "true") {
				this.element.style.display = "none";
			}
			else {
				this.element.style.display = "block";
			}
		}
		// show
		if (this.name === attributes.show) {
			if (this.valueRendered === null || this.valueRendered === undefined || this.valueRendered || this.valueRendered === "true") {
				this.element.style.display = "block";
			}
			else {
				this.element.style.display = "none";
			}
		}

		// allow change
		if ( (!this.hasNameChanged && !this.hasValueChanged) || !this.nameRendered) return;

		if (this.hasNameChanged && this.previousName) {
			this.element.removeAttribute(this.previousName);
		}
		this.previousName = this.nameRendered;

		// src
		if (this.name === attributes.src) {
			this.element.setAttribute("src", this.valueRendered);
			this.element.removeAttribute(this.nameRendered);
			return;
		}
		// href
		if (this.name === attributes.href) {
			this.element.setAttribute("href", this.valueRendered);
			this.element.removeAttribute(this.nameRendered);
			return;
		}

		// others
		var val = isArray(this.valueRendered) ? this.valueRendered.join(' ') : this.valueRendered;
		if (this.nameRendered === "class" && this.element.className) {
			this.element.className = val;
		}
		else {
			this.element.setAttribute(this.nameRendered, val);
			this.element.removeAttribute(this.name);
		}
	}
	Attribute.prototype.renderName = function(data) {
		if (!this.nameSequence) return;
		var newName = renderSequence(this.nameSequence, data);
		if (newName && newName.indexOf(tokens.start) === -1 && newName !== this.nameRendered) {
			this.hasNameChanged = true;
			this.nameRendered = newName;
		}
	}
	Attribute.prototype.renderValue = function(data) {
		if (!this.valueSequence || this.valueSequence.length === 0) return;
		var newValue = renderSequence(this.valueSequence, data);
		if (!equals(newValue, this.valueRendered)) {
			this.hasValueChanged = true;
			this.valueRendered = newValue;
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

	function getParamsFromString(value) {
		return value.split(regex.findParams);
	}

	var Expression = function(value) {
		this.value = value;
		this.valueRendered;
		this.isFunction = isExpFunction(this.value)
		this.path = getExpressionPath(this.value);
		this.name = getExpressionName(this.value);
		this.params = !this.isFunction ? null : getParamsFromString(value.match(regex.findFunction)[2]);
	};
	Expression.prototype.render = function(data) {
		var pathParts = this.path.split('.');
		var path = data.data;
		if (pathParts[0] !== "") {
			var i = -1, l = pathParts.length;
			while (++i < l) {
				path = path[pathParts[i]];
			}
		}
		if (!this.isFunction) {
			var newValue = path[this.name];
			return this.valueRendered = newValue;
		}
		else {
			if (!isFunction(path[this.name])) return null;
			var params = [];
			var i = -1, l = this.params.length;
			while (++i < l) {
				var p = this.params[i];
				if (p.match(regex.findQuote)) {
					params.push(p.replace(regex.findQuote, ''));
				}
				else {
					var exp = new Expression(p);
					params.push(exp.render(data))
				}
			}
			var newFunctionValue = path[this.name].apply(null, params);
			return this.valueRendered = newFunctionValue;
		}
		return null;
	}

	var Interpolation = function(value) {
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
		return getInterpolationPart(value, isTextNode);
	}

	function hasInterpolation(value) {
		var matches = value.match(regex.token);
		return matches && matches.length > 0;
	}

	// compile

	function isNodeValid(node) {
		var type = node.nodeType;
		if (!node || !type) return false;
		// comment
		if (type === 8) return false;
		// empty text node
		var hasContent = regex.findContent.test(node.nodeValue);
		if (type === 3 && !hasContent) return false;
		// result
		return true;
	}

	function compileNodes(node, nodeList) {
		if (!isNodeValid(node)) return;
		var analyseFunc = node.nodeType === 3 ? analyseTextNode : analyseNode;
		var interpolationNode = analyseFunc(node);
		if (interpolationNode) nodeList.push(interpolationNode);
		// children
		var child = node.firstChild;
		while (child) {
			compileNodes(child, nodeList);
			child = child.nextSibling;
		}
	}

	function analyseTextNode(node) {
		if (hasInterpolation(node.nodeValue)) {
			var n = new Node(node, node.nodeValue);
			return n;
		}
		return null;
	}

	function analyseNode(node) {
		var attributes = [];
		var repeater;
		for (var attr, name, value, attrs = node.attributes, j = 0, jj = attrs && attrs.length; j < jj; j++) {
			attr = attrs[j];
			if (attr.specified) {
				name = attr.name;
				value = attr.value;
				if (name === settings.attributes.repeat) {
					repeater = value;
				}
				var a;
				if (hasInterpolation(name + ':' + value)) {
					a = new Attribute(node, name, value);
					attributes.push(a);
				}
				else if (
						name === settings.attributes.skip ||
						name === settings.attributes.hide ||
						name === settings.attributes.show ||
						name === settings.attributes.href ||
						name === settings.attributes.repeat
					) {
					a = new Attribute(node, name, value);
					attributes.push(a);
				}
			}
		}
		if (attributes) {
			var n = new Node(node, node.nodeValue, attributes, repeater);
			return n;
		}
		return null;
	}

	function compile(element) {
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

		function compileTemplate() {
			// TODO: dispose previous hashmap
			scope.nodeList.length = 0;
			compileNodes(element, scope.nodeList);
		}

		function renderTemplate(data) {
			if (scope.nodeList) {
				if (data) scope.data = data;
				renderNodes(scope, element, scope.nodeList);
			}
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
		var i = -1, l = nodeList.length;
		while (++i < l) {
			var interpolationNode = nodeList[i];
			if (interpolationNode.skipped()) return;
			interpolationNode.render(data);
			if (interpolationNode.repeater) {
				return;
			}
		}
	}

	// scope

	var Scope = function(obj) {
		var tree = addScope(obj);
		function addScope(obj, parent) {
			var o = {
				parent: parent,
				nodeList: [],
				data: obj,
				children: [],
				add: addScope
			};
			if (parent) parent.children.push(o);
			return o;
		}
		return tree;
	};

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