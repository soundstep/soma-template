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
function isAttributeDefined(value) {
	return (value === "" || value === true || value === "true" || !isDefined(value));
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
function trimQuotes(value) {
	if (regex.string.test(value)) {
		return value.substr(1, value.length-2);
	}
	return value;
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


