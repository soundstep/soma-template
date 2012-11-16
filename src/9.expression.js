var Expression = function(pattern, node, attribute) {
	if (!isDefined(pattern)) return;
	this.pattern = pattern;
	this.isString = regex.string.test(pattern);
	this.node = node;
	this.attribute = attribute;
	this.value = this.isString ? this.pattern : undefined;
	if (this.isString) {
		this.isFunction = false;
		this.depth = null;
		this.path = null;
		this.params = null;
	}
	else {
		this.isFunction = isExpFunction(this.pattern);
		this.depth = getScopeDepth(this.pattern);
		this.path = getExpressionPath(this.pattern);
		this.params = !this.isFunction ? null : getParamsFromString(this.pattern.match(regex.func)[2]);
	}
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
		return getValue(scope, this.pattern, this.path, this.params);
	}
};
