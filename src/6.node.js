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
		this.isRepeaterChild = false;
		this.parent = null;
		this.children = [];
		this.childrenRepeater = [];
		this.previousSibling = null;
		this.nextSibling = null;
		this.template = null;
		this.eventHandlers = {};
		this.html = false;

		if (isTextNode(this.element)) {
			this.value = this.element.nodeValue;
			this.interpolation = new Interpolation(this.value, this, undefined);
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
				for (i = 0, l = this.children.length; i < l; i++) {
					this.children[i].dispose();
				}
			}
			if (this.childrenRepeater) {
				for (i = 0, l = this.childrenRepeater.length; i < l; i++) {
					this.childrenRepeater[i].dispose();
				}
			}
			if (this.attributes) {
				for (i = 0, l = this.attributes.length; i < l; i++) {
					this.attributes[i].dispose();
				}
			}
			if (this.interpolation) {
				this.interpolation.dispose();
			}
			this.element = null;
			this.scope = null;
			this.attributes = null;
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
			if (element === this.element) {
				return this;
			}
			if (this.childrenRepeater.length > 0) {
				for (var k = 0, kl = this.childrenRepeater.length; k < kl; k++) {
					node = this.childrenRepeater[k].getNode(element);
					if (node) {
						return node;
					}
				}
			}
			for (var i = 0, l = this.children.length; i < l; i++) {
				node = this.children[i].getNode(element);
				if (node) {
					return node;
				}
			}
			return null;
		},
		getAttribute: function(name) {
			if (this.attributes) {
				for (var i = 0, l = this.attributes.length; i < l; i++) {
					var att = this.attributes[i];
					if (att.interpolationName && att.interpolationName.value === name) {
						return att;
					}
				}
			}
		},
		update: function() {
			if (childNodeIsTemplate(this)) {
				return;
			}
			if (isDefined(this.interpolation)) {
				this.interpolation.update();
			}
			if (isDefined(this.attributes)) {
				for (var i = 0, l = this.attributes.length; i < l; i++) {
					this.attributes[i].update();
				}
			}
			updateNodeChildren(this);
		},
		invalidateData: function() {
			if (childNodeIsTemplate(this)) {
				return;
			}
			this.invalidate = true;
			var i, l;
			if (this.attributes) {
				for (i = 0, l = this.attributes.length; i < l; i++) {
					this.attributes[i].invalidate = true;
				}
			}
			for (i = 0, l = this.childrenRepeater.length; i < l; i++) {
				this.childrenRepeater[i].invalidateData();
			}
			for (i = 0, l = this.children.length; i < l; i++) {
				this.children[i].invalidateData();
			}
		},
		addEvent: function(type, pattern) {
			if (this.repeater) {
				return;
			}
			if (this.eventHandlers[type]) {
				this.removeEvent(type);
			}
			var scope = this.scope;
			var handler = function(event) {
				var exp = new Expression(pattern, this.node);
				var func = exp.getValue(scope, true);
				var params = exp.getValue(scope, false, true);
				params.unshift(event);
				if (func) {
					func.apply(null, params);
				}
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
					if (this.eventHandlers.hasOwnProperty(key)) {
						this.removeEvent(key);
					}
				}
			}
			if (this.children) {
				for (var k = 0, kl = this.children.length; k < kl; k++) {
					this.children[k].clearEvents();
				}
			}
			if (this.childrenRepeater) {
				for (var f = 0, fl = this.childrenRepeater.length; f < fl; f++) {
					this.childrenRepeater[f].clearEvents();
				}
			}
		},
		render: function() {
			if (childNodeIsTemplate(this)) {
				return;
			}
			if (this.invalidate) {
				this.invalidate = false;
				if (isTextNode(this.element)) {
					if (this.parent && this.parent.html) {
						this.value = this.parent.element.innerHTML = this.interpolation.render();
					}
					else {
						this.value = this.element.nodeValue = this.interpolation.render();
					}
				}
			}
			if (this.attributes) {
				for (var i = 0, l = this.attributes.length; i < l; i++) {
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