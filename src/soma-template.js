;(function (soma, undefined) {

	'use strict';

	soma.template = soma.source || {};
	soma.template.version = "0.0.1";

	var errors = soma.template.errors = {
		COMPILE_NO_ELEMENT: "Error in soma.Template.compile(), no target specified: template.source(element).compile(data).",
		REPEAT_WRONG_ARGUMENTS: "Error in template, repeat attribute requires this syntax: 'item in items'."
	};

	var settings = soma.template.settings = soma.template.settings || {};
	var tokens = settings.tokens = {
		start:"{{",
		end:"}}"
	};
	var regex = settings.regex = {
		pattern:new RegExp(tokens.start + "(.*?)" + tokens.end, "gm"),
		path:new RegExp(tokens.start + "|" + tokens.end, "gm"),
		repeat:/(.*)\s+in\s+(.*)/,
		findFunction:/(.*)\((.*)\)/,
		findParams:/,\s+|,|\s+,\s+/,
		findString:/('|")(.*)('|")/,
		findDoubleQuote:/\"/g,
		findSingleQuote:/\'/g
	};
	var attributes = settings.attrs = {
		skip:"data-skip"
	};
	var vars = settings.vars = {
		index:"index"
	};

	var isArray = function(value) {
		return toString.apply(value) === '[object Array]';
	};

	var isObject = function(value) {
		return typeof value === 'object';
	}

	var isElement = function(value) {
		return value ? value.nodeType > 0 : false;
	};

	var getValue = function(obj, val) {
		var fnParts = val.match(regex.findFunction);
		var parts;
		if (fnParts) {
			// has path in
			parts = fnParts[1].split('.');
			parts[1] += '(' + fnParts[2] + ')'
		}
		else {
			parts = val.split('.');
		}
		var val = obj;
		for (var i=0; i<parts.length; i++) {
			var fp = parts[i].match(regex.findFunction);
			if (fp) {
				var f = fp[1];
				var p = fp[2];
				if (typeof val[f] !== 'function') return undefined;
				if (p && p !== "") {
					var params = [];
					if (p.match(regex.findString)) {
						// string
						p = p.replace(regex.findDoubleQuote, "");
						p = p.replace(regex.findSingleQuote, "");
						params = p.split(regex.findParams);
					}
					else {
						// value
						var pp = p.split(regex.findParams);
						for (var k=0; k<pp.length; k++) {
							params.push(getValue(obj, pp[k]));
						}
					}
				}
				var fnVal = val[f].apply(this, params);
				if (!fnVal) return undefined;
				return fnVal;
			}
			else {
				if (!val[parts[i]]) return undefined;
				val = val[parts[i]];
			}
		}
		return val;
	};

	var replaceIndex = function(index, path, value, match) {
		var val = value;
		if (path === vars.index && index !== undefined) {
			return val.replace(match, index);
		}
		return val;
	};

	var replaceMatches = function(value, obj, index) {
		var str = value;
		var matches = str.match(regex.pattern);
		if (matches) {
			for (var i = 0; i < matches.length; i++) {
				var path = matches[i].replace(regex.path, "");
				var val = getValue(obj, path);
				if (val) str = str.replace(matches[i], val);
				str = replaceIndex(index, path, str, matches[i]);
			}
		}
		return str;
	};

	var replaceNodeValue = function(el, obj, index) {
		if (el.nodeValue) {
			el.nodeValue = replaceMatches(el.nodeValue, obj, index);
		}
	};

	var applyTemplate = function (el, obj, index) {
		var matches, path, val;
		// comment
		if (el.nodeName === "#comment") return;
		// skip
		if (el.getAttribute && el.getAttribute(attributes.skip) !== null) return;
		// node value
		replaceNodeValue(el, obj, index);
		// attributes
		if (el.attributes) {
			for (var attr, i = 0, attrs = el.attributes, l = attrs.length; i < l; i++) {
				attr = attrs.item(i);
				var nn = attr.nodeName;
				var nv = attr.nodeValue;
				if (nn === "data-repeat") {
					// repeat attribute
					matches = nv.match(regex.repeat);
					if (!matches || matches.length !== 3) {
						throw new Error(errors.REPEAT_WRONG_ARGUMENTS);
					}
					else {
						var itVar = matches[1];
						var itPath = matches[2];
						var itSource = getValue(obj, itPath);
						if (isArray(itSource)) {
							for (var k = 0; k < itSource.length; k++) {
								var o1 = {};
								o1[itVar] = itSource[k];
								var newNode = el.cloneNode(true);
								newNode.removeAttribute('data-repeat');
								el.parentNode.appendChild(newNode);
								applyTemplate(newNode, o1, k);
							}
							el.parentNode.removeChild(el);
						}
						else if (isObject(itSource)) {
							for (var o in itSource) {
								var o2 = {};
								o2[itVar] = itSource;
								var newNode = el.cloneNode(true);
								newNode.removeAttribute('data-repeat');
								el.parentNode.appendChild(newNode);
								applyTemplate(newNode, o2);
							}
							el.parentNode.removeChild(el);
						}
					}
				}
				else if (nn === "data-src") {
					// src attribute
					matches = nv.match(regex.pattern);
					if (matches) {
						for (var i = 0; i < matches.length; i++) {
							var path = matches[i].replace(regex.path, "");
							var val = getValue(obj, path);
							if (val) nv = nv.replace(matches[i], val);
							if (path === "index" && index !== undefined) {
								nv = nv.replace(matches[i], index);
							}
						}
						el.setAttribute("src", nv);
						el.removeAttribute("data-src");
					}
				}
				else if (nn === "data-href") {
					// src attribute
					matches = nv.match(regex.pattern);
					if (matches) {
						for (var i = 0; i < matches.length; i++) {
							var path = matches[i].replace(regex.path, "");
							var val = getValue(obj, path);
							if (val) nv = nv.replace(matches[i], val);
							if (path === "index" && index !== undefined) {
								nv = nv.replace(matches[i], index);
							}
						}
						el.setAttribute("href", nv);
						el.removeAttribute("data-href");
					}
				}
				else if (nn === "data-show") {
					// src attribute
					matches = nv.match(regex.pattern);
					if (matches) {
						for (var i = 0; i < matches.length; i++) {
							var path = matches[i].replace(regex.path, "");
							var val = getValue(obj, path);
							if (val) el.style.display = "block";
						}
						el.removeAttribute("data-show");
					}
				}
				else if (nn === "data-hide") {
					// src attribute
					matches = nv.match(regex.pattern);
					if (matches) {
						for (var i = 0; i < matches.length; i++) {
							var path = matches[i].replace(regex.path, "");
							var val = getValue(obj, path);
							if (val) el.style.display = "none";
						}
						el.removeAttribute("data-hide");
					}
				}
				else {
					// normal attribute (node name)
					matches = nn.match(regex.pattern);
					if (matches) {
						for (var i = 0; i < matches.length; i++) {
							var path = matches[i].replace(regex.path, "");
							var val = getValue(obj, path);
							if (val) nn = nn.replace(matches[i], val);
							el.removeAttribute(matches[i]);
						}

					}
					// normal attribute (node value)
					matches = nv.match(regex.pattern);
					if (matches) {
						for (var i = 0; i < matches.length; i++) {
							var path = matches[i].replace(regex.path, "");
							if (path === "index" && index !== undefined) {
								nv = nv.replace(matches[i], index);
							}
							else {
								var val = getValue(obj, path);
								if (val !== undefined) {
									nv = nv.replace(matches[i], val);
								}
								else {
									nv = nv.replace(matches[i], "");
								}
							}
						}
					}
					el.setAttribute(nn, nv);
				}
			}
		}
		// process children
		if (el.childNodes.length > 0) {
			if (el.getAttribute && el.getAttribute('data-repeat')) {
				return;
			}
			for (var i = 0; i < el.childNodes.length; i++) {
				var child = el.childNodes[i];
				applyTemplate(child, obj, index);
			}
		}

	}

	soma.Template = function (source) {

		var tpl, cache, el;

		if (source) setSource(source);

		function setSource(source) {
			tpl = source;
			cache = isElement(tpl) ? tpl.innerHTML : tpl;
		};

		return {
			source: function(source) {
				setSource(source);
			},
			target:function (element) {
				el = element;
				return this;
			},
			compile:function (data) {
				if (!el) {
					if (!isElement(tpl)) throw new Error(errors.COMPILE_NO_ELEMENT);
					else el = tpl;
				}
				el.innerHTML = cache;
				applyTemplate(el, data);
				return this;
			},
			dispose: function() {
				tpl = null;
				cache = null;
				el = null;
				return this;
			}
		}
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

})(this['soma'] = this['soma'] || {});