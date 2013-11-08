	var ie = (function(){
		if (typeof document !== 'object') {
			return undefined;
		}
		var v = 3,
			stop = false,
			div = document.createElement('div');
		while (!stop) {
			div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->';
			if (!div.getElementsByTagName('i')[0]) {
				stop = true;
			}
		}
		return v > 4 ? v : undefined;
	}());
	function isArray(value) {
		return Object.prototype.toString.apply(value) === '[object Array]';
	}
	function isObject(value) {
		return typeof value === 'object';
	}
	function isString(value) {
		return typeof value === 'string';
	}
	function isElement(value) {
		return value ? value.nodeType > 0 : false;
	}
	function isTextNode(el) {
		return el && el.nodeType && el.nodeType === 3;
	}
	function isFunction(value) {
		return value && typeof value === 'function';
	}
	function isDefined(value) {
		return value !== null && value !== undefined;
	}
	function normalizeBoolean(value) {
		if (!isDefined(value)) {
			return false;
		}
		if (value === 'true' || value === '1' || value === true || value === 1) {
			return true;
		}
		if (value === 'false' || value === '0' || value === false || value === 0 || (isString(value) && hasInterpolation(value))) {
			return false;
		}
		return !!value;
	}
	function isExpression(value) {
		return value && isFunction(value.toString) && value.toString() === '[object Expression]';
	}
	function isExpFunction(value) {
		if (!isString(value)) {
			return false;
		}
		return !!value.match(regex.func);
	}
	function childNodeIsTemplate(node) {
		return node && node.parent && templates.get(node.element);
	}
	function escapeRegExp(str) {
		return str.replace(regex.escape, '\\$&');
	}
	function setRegEX(nonEscapedValue, isStartToken) {
		// sequence: \{\{.+?\}\}|[^{]+|\{(?!\{)[^{]*
		var unescapedCurrentStartToken = tokens.start().replace(/\\/g, '');
		var endSequence = '';
		var ts = isStartToken ? nonEscapedValue : unescapedCurrentStartToken;
		if (ts.length > 1) {
			endSequence = '|\\' + ts.substr(0, 1) + '(?!\\' + ts.substr(1, 1) + ')[^' + ts.substr(0, 1) + ']*';
		}
		regex.sequence = new RegExp(tokens.start() + '.+?' + tokens.end() + '|[^' + tokens.start() + ']+' + endSequence, 'g');
		regex.token = new RegExp(tokens.start() + '.*?' + tokens.end(), 'g');
		regex.expression = new RegExp(tokens.start() + '|' + tokens.end(), 'gm');
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
		if (value[0] === '') {
			value.shift();
		}
		if (value[value.length-1] === '') {
			value.pop();
		}
		return value;
	}
	function trimTokens(value) {
		return value.replace(regex.expression, '');
	}
	function trimScopeDepth(value) {
		return value.replace(regex.depth, '');
	}
	function insertBefore(referenceNode, newNode) {
		if (!referenceNode.parentNode) {
			return;
		}
		referenceNode.parentNode.insertBefore(newNode, referenceNode);
	}
	function insertAfter(referenceNode, newNode) {
		if (!referenceNode.parentNode) {
			return;
		}
		referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	}
	function removeClass(elm, className) {
		var rmc;
		if (typeof document === 'object' && document.documentElement.classList) {
			rmc = function (elm, className) {
				elm.classList.remove(className);
			};
		} else {
			rmc = function (elm, className) {
				if (!elm || !elm.className) {
					return false;
				}
				var reg = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g');
				elm.className = elm.className.replace(reg, '$2');
			};
		}
		rmc(elm, className);
	}
	// jquery contains
	var contains = typeof document !== 'object' ? function(){} : document.documentElement.contains ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && adown.contains && adown.contains(bup) );
		} :
		document.documentElement.compareDocumentPosition ?
			function( a, b ) {
				return b && !!( a.compareDocumentPosition( b ) & 16 );
			} :
			function( a, b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
				return false;
			};

	function HashMap(id) {
		var items = {};
		var count = 0;
		//var uuid = function(a,b){for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');return b;}
		function uuid() { return ++count + id; }
		function getKey(target) {
			if (!target) {
				return;
			}
			if (typeof target !== 'object') {
				return target;
			}
			var result;
			try {
				// IE 7-8 needs a try catch, seems like I can't add a property on text nodes
				result = target[id] ? target[id] : target[id] = uuid();
			} catch(err){}
			return result;
		}
		this.remove = function(key) {
			delete items[getKey(key)];
		};
		this.get = function(key) {
			return items[getKey(key)];
		};
		this.put = function(key, value) {
			items[getKey(key)] = value;
		};
		this.has = function(key) {
			return typeof items[getKey(key)] !== 'undefined';
		};
		this.getData = function() {
			return items;
		};
		this.dispose = function() {
			for (var key in items) {
				if (items.hasOwnProperty(key)) {
					delete items[key];
				}
			}
			this.length = 0;
		};
	}
