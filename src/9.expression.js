var Expression = function(pattern, node, attribute) {
	this.pattern = pattern;
	this.node = node;
	this.attribute = attribute;
	this.isFunction = isExpFunction(this.pattern);
	this.path = getExpressionPath(this.pattern);
	this.accessor = getExpressionAccessor(this.pattern);
	this.params = !this.isFunction ? null : getParamsFromString(this.pattern.match(regex.func)[2]);
	this.value;
	this.watchers = [];
};
Expression.prototype = {
	toString: function() {
		return '[object Expression]';
	},
	update: function() {
		var node = this.node || this.attribute.node;
		var newValue = this.getValue(node.scope);
		newValue = getWatcherValue(this, newValue);
		if (this.value !== newValue) {
			this.value = newValue;
			(this.node || this.attribute).invalidate = true;
		}
	},
	getValue: function(scope) {
		return getValue(scope, this.path, this.accessor, this.params, this.isFunction);
	}
};
