function getExpArrayParts(value) {
	if (!isString(value)) return false;
	var matches = value.match(regex.array);
	if (!matches || matches.length < 2) return null;
	else return matches;
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

function getValueFromPattern(scope, pattern) {
	var exp = new Expression(pattern);
	return getValue(scope, exp.pattern, exp.path, exp.params, exp.isFunction);
}

function getValue(scope, pattern, pathString, params, paramsFound) {
	// string
	if (regex.string.test(pattern)) {
		return trimQuotes(pattern);
	}
	// find params
	var paramsValues = [];
	if (!paramsFound && params) {
		var j = -1, jl = params.length;
		while (++j < jl) {
			paramsValues.push(getValueFromPattern(scope, params[j]));
		}
	}
	else paramsValues = paramsFound;
	// find scope
	var scopeTarget = getScopeFromPattern(scope, pattern);
	// remove parent string
	pattern = pattern.replace(/..\//g, '');
	pathString = pathString.replace(/..\//g, '');
	if (!scopeTarget) return undefined;
	// search path
	var path = scopeTarget;
	var pathParts = pathString.split(/\.|\[|\]/g);
	if (pathParts.length > 0) {
		var i = -1, l = pathParts.length;
		while (++i < l) {
			if (pathParts[i] !== "") {
				path = path[pathParts[i]];
			}
			if (!isDefined(path)) {
				// no path, search in parent
				if (scopeTarget._parent) return getValue(scopeTarget._parent, pattern, pathString, params, paramsValues);
				else return undefined;
			}
		}
	}
	// return value
	if (!isFunction(path)) {
		return path;
	}
	else {
		return path.apply(null, paramsValues);
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
					name === settings.attributes.checked ||
					name === settings.attributes.disabled ||
					name === settings.attributes.multiple ||
					name === settings.attributes.readonly ||
					name === settings.attributes.selected ||
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
		node = getNodeFromElement(element, parent ? parent.scope : new Scope(helpersScopeObject)._createChild());
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
	var previousElement;
	if (isArray(data)) {
		// process array
		var i = -1;
		var l1 = data.length;
		var l2 = node.childrenRepeater.length;
		var l = l1 > l2 ? l1 : l2;
		while (++i < l) {
			if (i < l1) {
				previousElement = createRepeaterChild(node, i, data[i], vars.index, i, previousElement);
			}
			else {
				// todo: dispose node
				node.parent.element.removeChild(node.childrenRepeater[i].element);
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
			count++;
			previousElement = createRepeaterChild(node, count, data[o], vars.key, o, previousElement);
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

function createRepeaterChild(node, count, data, indexVar, indexVarValue, previousElement) {
	var existingChild = node.childrenRepeater[count];
	if (!existingChild) {
		// no existing node
		var newElement = node.element.cloneNode(true);
		var newNode = getNodeFromElement(newElement, node.scope._createChild(), true);
		newNode.parent = node.parent;
		newNode.template = node.template;
		node.childrenRepeater[count] = newNode;
		updateScopeWithRepeaterData(node.repeater, newNode.scope, data);
		newNode.scope[indexVar] = indexVarValue;
		compile(node.template, newElement, node.parent, newNode);
		newNode.update();
		newNode.render();
		if (!previousElement) {
			if (node.previousSibling) insertAfter(node.previousSibling, newElement);
			else if (node.nextSibling) insertBefore(node.nextSibling, newElement);
			else node.parent.element.appendChild(newElement);
		}
		else {
			insertAfter(previousElement, newElement);
		}
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
