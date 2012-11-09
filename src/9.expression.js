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
