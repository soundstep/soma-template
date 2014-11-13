	function getRepeaterData(repeaterValue, scope) {
		var parts = repeaterValue.match(regex.repeat);
		if (!parts) {
			return;
		}
		var source = parts[2];
		var exp = new Expression(source);
		return exp.getValue(scope);
	}

	function updateScopeWithRepeaterData(repeaterValue, scope, data) {
		var parts = repeaterValue.match(regex.repeat);
		if (!parts) {
			return;
		}
		var name = parts[1];
		scope[name] = data;
	}
	function getWatcherValue(exp, newValue) {
		var node = exp.node || exp.attribute.node;
		var watchers = node.template.watchers;
		var nodeTarget = node.element;
		if (!watchers) {
			return newValue;
		}
		var watcherNode = watchers.get(nodeTarget);
		if (!watcherNode && isTextNode(node.element) && node.parent) {
			watcherNode = watchers.get(node.parent.element);
		}
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

	function getValueFromPattern(scope, pattern, context) {
		var exp = new Expression(pattern);
		return getValue(scope, exp.pattern, exp.path, exp.params, undefined, undefined, undefined, context);
	}

	function getValue(scope, pattern, pathString, params, getFunction, getParams, paramsFound, context) {
		// context
		if (pattern === vars.element) {
			return context[vars.element];
		}
		if (pattern === vars.parentElement) {
			return context[vars.parentElement];
		}
		if (pattern === vars.attribute) {
			return context[vars.attribute];
		}
		if (pattern === vars.scope) {
			return context[vars.scope];
		}
		// string
		if (regex.string.test(pattern)) {
			return trimQuotes(pattern);
		}
		// find params
		var paramsValues = [];
		if (!paramsFound && params) {
			for (var j = 0, jl = params.length; j < jl; j++) {
				paramsValues.push(getValueFromPattern(scope, params[j], context));
			}
		}
		else {
			paramsValues = paramsFound;
		}
		if (getParams) {
			return paramsValues;
		}
		// find scope
		var scopeTarget = getScopeFromPattern(scope, pattern);
		// remove parent string
		pattern = pattern.replace(/..\//g, '');
		pathString = pathString.replace(/..\//g, '');
		if (!scopeTarget) {
			return undefined;
		}
		// search path
		var path = scopeTarget;
		var pathParts = pathString.split(/\.|\[|\]/g);
		if (pathParts.length > 0) {
			for (var i = 0, l = pathParts.length; i < l; i++) {
				if (pathParts[i] !== '') {
					path = path[pathParts[i]];
				}
				if (!isDefined(path)) {
					// no path, search in parent
					if (scopeTarget._parent) {
						return getValue(scopeTarget._parent, pattern, pathString, params, getFunction, getParams, paramsValues);
					}
					else {
						return undefined;
					}
				}
			}
		}
		// return value
		if (!isFunction(path)) {
			return path;
		}
		else {
			if (getFunction) {
				return path;
			}
			else {
				return path.apply(null, paramsValues);
			}
		}
		return undefined;
	}

	function getExpressionPath(value) {
		var val = value.split('(')[0];
		val = trimScopeDepth(val);
		return val;
	}

	function getParamsFromString(value) {
		return trimArray(value.split(regex.params));
	}

	function getScopeDepth(value) {
		var val = value.split('(')[0];
		var matches = val.match(regex.depth);
		return !matches ? 0 : matches.length;
	}

	function addAttribute(node, name, value) {
		var attr;
		node.attributes = node.attributes || [];
		if (name === settings.attributes.skip) {
			node.skip = normalizeBoolean(value);
		}
		if (name === settings.attributes.html) {
			node.html = normalizeBoolean(value);
		}
		if (name === settings.attributes.repeat && !node.isRepeaterDescendant) {
			node.repeater = value;
		}
		if (
			hasInterpolation(name + ':' + value) ||
				name === settings.attributes.repeat ||
				name === settings.attributes.skip ||
				name === settings.attributes.html ||
				name === settings.attributes.show ||
				name === settings.attributes.hide ||
				name === settings.attributes.href ||
        name === settings.attributes.class ||
				name === settings.attributes.checked ||
				name === settings.attributes.disabled ||
				name === settings.attributes.multiple ||
				name === settings.attributes.readonly ||
				name === settings.attributes.selected ||
				value.indexOf(settings.attributes.cloak) !== -1
			) {
			attr = new Attribute(name, value, node);
			node.attributes.push(attr);
		}
		if (events[name]) {
			attr = new Attribute(name, value, node);
			node.attributes.push(attr);
		}
		return attr;
	}

	function getNodeFromElement(element, scope) {
		var node = new Node(element, scope);
		node.previousSibling = element.previousSibling;
		node.nextSibling = element.nextSibling;
		var eventsArray = [];
		for (var attr, attrs = element.attributes, j = 0, jj = attrs && attrs.length; j < jj; j++) {
			attr = attrs[j];
			if (attr.specified || attr.name === 'value') {
				var newAttr = addAttribute(node, attr.name, attr.value);
				if (events[attr.name]) {
					if (events[attr.name] && !node.isRepeaterChild) {
						eventsArray.push({name:events[attr.name], value:attr.value, attr: newAttr});
					}
				}
			}
		}
		for (var a=0, b=eventsArray.length; a<b; a++) {
			node.addEvent(eventsArray[a].name, eventsArray[a].value, eventsArray[a].attr);
		}
		return node;
	}

	function hasInterpolation(value) {
		var matches = value.match(regex.token);
		return matches && matches.length > 0;
	}

	function hasContent(value) {
		return regex.content.test(value);
	}

	function isElementValid(element) {
		if (!element) {
			return;
		}
		var type = element.nodeType;
		if (!element || !type) {
			return false;
		}
		// comment
		if (type === 8) {
			return false;
		}
		// empty text node
		if (type === 3 && !hasContent(element.nodeValue) && !hasInterpolation(element.nodeValue)) {
			return false;
		}
		// result
		return true;
	}

	function compile(template, element, parent, nodeTarget) {
		if (!isElementValid(element)) {
			return;
		}
		// get node
		var node;
		if (!nodeTarget) {
			node = getNodeFromElement(element, parent ? parent.scope : new Scope(helpersScopeObject)._createChild());
		}
		else {
			node = nodeTarget;
			node.parent = parent;
		}
		if (parent && (parent.repeater || parent.isRepeaterChild)) {
			node.isRepeaterChild = true;
		}
		node.template = template;
		// children
		if (node.skip) {
			return;
		}
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
			if (data.hasOwnProperty(d)) {
				scope[d] = data[d];
			}
		}
	}

	function clearScope(scope) {
		for (var key in scope) {
			if (scope.hasOwnProperty(key)) {
				if (key.substr(0, 1) !== '_') {
					scope[key] = null;
					delete scope[key];
				}
			}
		}
	}

	function updateNodeChildren(node) {
		if (node.repeater || !node.children || childNodeIsTemplate(node)) {
			return;
		}
		for (var i = 0, l = node.children.length; i < l; i++) {
			node.children[i].update();
		}
	}

	function renderNodeChildren(node) {
		if (!node.children || childNodeIsTemplate(node)) {
			return;
		}
		for (var i = 0, l = node.children.length; i < l; i++) {
			node.children[i].render();
		}
	}

	function renderNodeRepeater(node) {
		var data = getRepeaterData(node.repeater, node.scope);
		var previousElement;
		if (isArray(data)) {
			// process array
			for (var i = 0, l1 = data.length, l2 = node.childrenRepeater.length, l = l1 > l2 ? l1 : l2; i < l; i++) {
				if (i < l1) {
					previousElement = createRepeaterChild(node, i, data[i], vars.index, i, previousElement);
				}
				else {
					node.parent.element.removeChild(node.childrenRepeater[i].element);
					node.childrenRepeater[i].dispose();
				}
			}
			if (node.childrenRepeater.length > data.length) {
				node.childrenRepeater.length = data.length;
			}
		}
		else {
			// process object
			var count = -1;
			for (var o in data) {
				if (data.hasOwnProperty(o)) {
					count++;
					previousElement = createRepeaterChild(node, count, data[o], vars.key, o, previousElement);
				}
			}
			var size = count;
			while (count++ < node.childrenRepeater.length-1) {
				node.parent.element.removeChild(node.childrenRepeater[count].element);
				node.childrenRepeater[count].dispose();
			}
			node.childrenRepeater.length = size+1;
		}
		if (node.element.parentNode) {
			node.element.parentNode.removeChild(node.element);
		}
	}

	function compileClone(node, newNode) {
		if (!isElementValid(newNode.element)) {
			return;
		}
		// create attribute
		if (node.attributes) {
			for (var i= 0, l=node.attributes.length; i<l; i++) {
				var attr = node.attributes[i];
				var newAttr = addAttribute(newNode, attr.name, attr.value);
				if (events[attr.name]) {
					newNode.addEvent(events[attr.name], attr.value, newAttr);
				}
			}
		}
		// children
		var child = node.element.firstChild;
		var newChild = newNode.element.firstChild;
		// loop
		while (child && newChild) {
			var childNode = node.getNode(child);
			var newChildNode = new Node(newChild, newNode.scope);
			newNode.children.push(newChildNode);
			newChildNode.parent = newNode;
			newChildNode.template = newNode.template;
			newChildNode.isRepeaterChild = true;
			var compiledNode = compileClone(childNode, newChildNode);
			if (compiledNode) {
				compiledNode.parent = newChildNode;
				compiledNode.template = newChildNode.template;
				newChildNode.children.push(compiledNode);
			}
			child = child.nextSibling;
			newChild = newChild.nextSibling;
		}
		return newChildNode;
	}

	function cloneRepeaterNode(element, node) {
		var newNode = new Node(element, node.scope._createChild());
		newNode.template = node.template;
		newNode.parent = node;
		newNode.isRepeaterChild = true;
		newNode.isRepeaterDescendant = true;
		compileClone(node, newNode);
		return newNode;
	}

	function appendRepeaterElement(previousElement, node, newElement) {
		if (!previousElement) {
			if (node.element.previousSibling) {
				insertAfter(node.element.previousSibling, newElement);
			}
			else if (node.element.nextSibling) {
				insertBefore(node.element.nextSibling, newElement);
			}
			else {
				node.parent.element.appendChild(newElement);
			}
		}
		else {
			insertAfter(previousElement, newElement);
		}
	}

	function createRepeaterChild(node, count, data, indexVar, indexVarValue, previousElement) {
		var existingChild = node.childrenRepeater[count];
		if (!existingChild) {
			var newElement = node.element.cloneNode(true);
			// need to append the cloned element to the DOM
			// before changing attributes or IE will crash
			appendRepeaterElement(previousElement, node, newElement);
			// can't recreate the node with a cloned element on IE7
			// be cause the attributes are not specified anymore (attribute.specified)
			//var newNode = getNodeFromElement(newElement, node.scope._createChild(), true);
			var newNode = cloneRepeaterNode(newElement, node);
			node.childrenRepeater[count] = newNode;
			updateScopeWithRepeaterData(node.repeater, newNode.scope, data);
			newNode.scope[indexVar] = indexVarValue;
			newNode.update();
			newNode.render();
			return newElement;
		}
		else {
			// existing node
			updateScopeWithRepeaterData(node.repeater, existingChild.scope, data);
			existingChild.scope[indexVar] = indexVarValue;
			existingChild.update();
			existingChild.render();
			return existingChild.element;
		}
	}
