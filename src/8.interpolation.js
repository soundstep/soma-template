var Interpolation = function(value, node, attribute) {
	this.value = node && !isTextNode(node.element) ? trim(value) : value;
	this.node = node;
	this.attribute = attribute;
	this.sequence = [];
	this.expressions = [];
	var parts = this.value.match(regex.sequence);
	if (parts) {
		var i = -1, l = parts.length;
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
	toString: function() {
		return '[object Interpolation]';
	},
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
