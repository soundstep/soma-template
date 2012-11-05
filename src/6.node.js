var Node = function(element, scope) {
	this.element = element;
	this.scope = scope;
	this.attributes = null;
	this.value = null;
	this.interpolation = null;
	this.invalidate = false;
	this.skip = false;
	this.repeater = null;
	this.parent = null;
	this.children = [];
	this.childrenRepeater = [];
	this.previousSibling = null;
	this.nextSibling = null;
	this.template = null;

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
	update: function() {
		if (childNodeIsTemplate(this)) return;
		if (isDefined(this.interpolation)) {
			this.interpolation.update();
		}
		if (isDefined(this.attributes)) {
			var i = -1, l = this.attributes.length;
			while (++i < l) {
				this.attributes[i].interpolationName.update();
				this.attributes[i].interpolationValue.update();
			}
		}
		this.updateChildren();
	},
	updateChildren: function() {
		if (childNodeIsTemplate(this) || this.repeater) return;
		var i = -1, l = this.children.length;
		while (++i < l) {
			this.children[i].update();
		}
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
	render: function() {
		if (childNodeIsTemplate(this)) return;
		if (this.invalidate) {
			this.invalidate = false;
			if (isTextNode(this.element)) {
				this.element.nodeValue = this.interpolation.render();
			}
		}
		if (this.attributes) {
			var i = -1, l = this.attributes.length;
			while (++i < l) {
				this.attributes[i].render();
			}
		}
		if (this.repeater) {
			this.renderRepeater();
		}
		else {
			this.renderChildren();
		}
	},
	renderChildren: function() {
		if (childNodeIsTemplate(this)) return;
		var i = -1, l = this.children.length;
		while (++i < l) {
			this.children[i].render();
		}
	},
	renderRepeater: function() {
		var data = getRepeaterData(this.repeater, this.scope);
		if (isArray(data)) {
			var i = -1;
			var l1 = data.length;
			var l2 = this.childrenRepeater.length;
			var l = l1 > l2 ? l1 : l2;
			while (++i < l) {
				if (i < l1) {
					var previousElement;
					var existingChild = this.childrenRepeater[i];
					if (!existingChild) {
						// no existing node
						var newElement = this.element.cloneNode(true);
						var newNode = getNodeFromElement(newElement, this.scope._createChild(), true);
						newNode.parent = this;
						newNode.template = this.template;
						this.childrenRepeater[i] = newNode;
						updateScopeWithRepeaterData(this.repeater, newNode.scope, data[i]);
						newNode.scope[vars.index] = i;
						compile(this.template, newElement, this.parent, newNode);
						newNode.update();
						newNode.render();
						if (!previousElement) {
							if (this.previousSibling) insertAfter(this.previousSibling, newElement);
							else if (this.nextSibling) insertBefore(this.nextSibling, newElement);
							else this.parent.element.appendChild(newElement);
						}
						else insertAfter(previousElement, newElement);
						previousElement = newNode.element;
					}
					else {
						// existing node
						updateScopeWithRepeaterData(this.repeater, existingChild.scope, data[i]);
						existingChild.scope[vars.index] = i;
						existingChild.update();
						existingChild.render();
						previousElement = existingChild.element;
					}
				}
				else {
					// todo: dispose node
					this.parent.element.removeChild(this.childrenRepeater[i].element);
				}
			}
			if (this.childrenRepeater.length > data.length) this.childrenRepeater.length = data.length;
		}
		else {
			var count = -1;
			for (var o in data) {
				count++;
				var previousElement;
				var existingChild = this.childrenRepeater[count];
				if (!existingChild) {
					// no existing node
					var newElement = this.element.cloneNode(true);
					var newNode = getNodeFromElement(newElement, this.scope._createChild(), true);
					newNode.parent = this.parent;
					newNode.template = this.template;
					this.childrenRepeater[count] = newNode;
					updateScopeWithRepeaterData(this.repeater, newNode.scope, data[o]);
					newNode.scope[vars.key] = o;
					compile(this.template, newElement, this.parent, newNode);
					newNode.update();
					newNode.render();
					if (!previousElement) {
						if (this.previousSibling) insertAfter(this.previousSibling, newElement);
						else if (this.nextSibling) insertBefore(this.nextSibling, newElement);
						else this.parent.element.appendChild(newElement);
					}
					else insertAfter(previousElement, newElement);
					previousElement = newNode.element;
				}
				else {
					// existing node
					updateScopeWithRepeaterData(this.repeater, existingChild.scope, data[o]);
					existingChild.scope[vars.key] = o;
					existingChild.update();
					existingChild.render();
					previousElement = existingChild.element;
				}
			}
			var size = count;
			while (count++ < this.childrenRepeater.length-1) {
				// todo: dispose node
				this.parent.element.removeChild(this.childrenRepeater[count].element);
			}
			this.childrenRepeater.length = size+1;
		}
		if (this.element.parentNode) {
			this.element.parentNode.removeChild(this.element);
		}
	}
};