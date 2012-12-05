var Node = function(element, scope) {
	this.element = element;
	this.scope = scope;
	this.attributes = null;
	this.value = null;
	this.interpolation = null;
	this.invalidate = false;
	this.skip = false;
	this.repeater = null;
	this.isRepeaterDescendant = false;
	this.parent = null;
	this.children = [];
	this.childrenRepeater = [];
	this.previousSibling = null;
	this.nextSibling = null;
	this.template = null;
	this.eventHandlers = {};

	if (isTextNode(this.element)) {
		this.value = this.element.nodeValue;
		this.interpolation = new Interpolation(this.value, this);
	}

};
Node.prototype = {
	toString: function() {
		return '[object Node]';
	},
	dispose: function() {
		this.clearEvents();
		var i, l;
		if (this.children) {
			i = -1; l = this.children.length;
			while (++i < l) {
				this.children[i].dispose();
			}
		}
		if (this.childrenRepeater) {
			i = 0; l = this.childrenRepeater.length;
			while (++i < l) {
				this.childrenRepeater[i].dispose();
			}
		}
		if (this.attributes) {
			i = 0; l = this.attributes.length;
			while (++i < l) {
				this.attributes[i].dispose();
			}
		}
		if (this.interpolation) {
			this.interpolation.dispose();
		}
		this.element = null;
		this.scope = null;
		this.attributes = null;
		this.attributesHashMap = null;
		this.value = null;
		this.interpolation = null;
		this.repeater = null;
		this.parent = null;
		this.children = null;
		this.childrenRepeater = null;
		this.previousSibling = null;
		this.nextSibling = null;
		this.template = null;
		this.eventHandlers = null;
	},
	getNode: function(element) {
		var node;
		if (element === this.element) return this;
		else if (this.childrenRepeater.length > 0) {
			var k = -1, kl = this.childrenRepeater.length;
			while (++k < kl) {
				node = this.childrenRepeater[k].getNode(element);
				if (node) return node;
			}
		}
		else {
			var i = -1, l = this.children.length;
			while (++i < l) {
				node = this.children[i].getNode(element);
				if (node) return node;
			}
		}
		return null;
	},
	getAttribute: function(name) {
		if (this.attributes) {
			var i = -1, l = this.attributes.length;
			while (++i < l) {
				var att = this.attributes[i];
				if (att.interpolationName && att.interpolationName.value === name) {
					return att;
				}
			}
		}
	},
	update: function() {
		if (childNodeIsTemplate(this)) return;
		if (isDefined(this.interpolation)) {
			this.interpolation.update();
		}
		if (isDefined(this.attributes)) {
			var i = -1, l = this.attributes.length;
			while (++i < l) {
				this.attributes[i].update();
			}
		}
		updateNodeChildren(this);
	},
	invalidateData: function() {
		if (childNodeIsTemplate(this)) return;
		this.invalidate = true;
		var i, l;
		if (this.attributes) {
			i = -1
			l = this.attributes.length;
			while (++i < l) {
				this.attributes[i].invalidate = true;
			}
		}
		i = -1;
		l = this.childrenRepeater.length;
		while (++i < l) {
			this.childrenRepeater[i].invalidateData();
		}
		i = -1;
		l = this.children.length;
		while (++i < l) {
			this.children[i].invalidateData();
		}
	},
	addEvent: function(type, pattern) {
		if (this.repeater) return;
		if (this.eventHandlers[type]) {
			this.removeEvent(type);
		}
		var scope = this.scope;
		var node = node;
		var handler = function(event) {
			var exp = new Expression(pattern, node);
			var func = exp.getValue(scope, true);
			var params = exp.getValue(scope, false, true);
			params.unshift(event);
			if (func) func.apply(null, params);
		};
		this.eventHandlers[type] = handler;
		addEvent(this.element, type, handler);
	},
	removeEvent: function(type) {
		removeEvent(this.element, type, this.eventHandlers[type]);
		this.eventHandlers[type] = null;
		delete this.eventHandlers[type];
	},
	clearEvents: function() {
		if (this.eventHandlers) {
			for (var key in this.eventHandlers) {
				this.removeEvent(key, this.eventHandlers[key]);
			}
		}
		if (this.children) {
			var k = -1, kl = this.children.length;
			while (++k < kl) {
				this.children[k].clearEvents();
			}
		}
		if (this.childrenRepeater) {
			var f = -1, fl = this.childrenRepeater.length;
			while (++f < fl) {
				this.childrenRepeater[f].clearEvents();
			}
		}
	},
	render: function() {
		if (childNodeIsTemplate(this)) return;
		if (this.invalidate) {
			this.invalidate = false;
			if (isTextNode(this.element)) {
				this.value = this.element.nodeValue = this.interpolation.render();
			}
		}
		if (this.attributes) {
			var i = -1, l = this.attributes.length;
			while (++i < l) {
				this.attributes[i].render();
			}
		}
		if (this.repeater) {
			renderNodeRepeater(this);
		}
		else {
			renderNodeChildren(this);
		}
	}
};