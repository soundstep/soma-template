	var Attribute = function(name, value, node) {
		this.name = name;
		this.value = value;
		this.node = node;
		this.interpolationName = new Interpolation(this.name, null, this);
		this.interpolationValue = new Interpolation(this.value, null, this);
		this.invalidate = false;
	};
	Attribute.prototype = {
		toString: function() {
			return '[object Attribute]';
		},
		dispose: function() {
			if (this.interpolationName) {
				this.interpolationName.dispose();
			}
			if (this.interpolationValue) {
				this.interpolationValue.dispose();
			}
			this.interpolationName = null;
			this.interpolationValue = null;
			this.node = null;
			this.name = null;
			this.value = null;
			this.previousName = null;
		},
		update: function() {
			this.interpolationName.update();
			this.interpolationValue.update();
		},
		render: function() {
			if (this.node.repeater) {
				return;
			}
			// normal attribute
			function renderAttribute(name, value) {
				if (ie === 7 && name === 'class') {
					element.className = value;
				}
				else {
					element.setAttribute(name, value);
				}
			}
			// special attribute
			function renderSpecialAttribute(value, attrName) {
				if (isAttributeDefined(value)) {
					element.setAttribute(attrName, attrName);
				}
				else {
					element.removeAttribute(attrName);
				}
			}
			// src attribute
			function renderSrc(value) {
				element.setAttribute('src', value);
			}
			// href attribute
			function renderHref(value) {
				element.setAttribute('href', value);
			}
			var element = this.node.element;
			if (this.invalidate) {
				this.invalidate = false;
				this.previousName = this.name;
				this.name = isDefined(this.interpolationName.render()) ? this.interpolationName.render() : this.name;
				this.value = isDefined(this.interpolationValue.render()) ? this.interpolationValue.render() : this.value;
				if (this.name === attributes.src) {
					renderSrc(this.value);
				}
				else if (this.name === attributes.href) {
					renderHref(this.value);
				}
				else {
					if (ie !== 7 || (ie === 7 && !this.node.isRepeaterChild)) {
						this.node.element.removeAttribute(this.interpolationName.value);
					}
					if (this.previousName) {
						if (ie === 7 && this.previousName === 'class') {
							// iE
							this.node.element.className = '';
						}
						else {
							if (ie !== 7 || (ie === 7 && !this.node.isRepeaterChild)) {
								this.node.element.removeAttribute(this.previousName);
							}
						}
					}
					renderAttribute(this.name, this.value, this.previousName);
				}
			}
			// cloak
			if (this.name === 'class' && this.value.indexOf(settings.attributes.cloak) !== -1) {
				removeClass(this.node.element, settings.attributes.cloak);
			}
			// hide
			if (this.name === attributes.hide) {
				element.style.display = isAttributeDefined(this.value) ? 'none' : 'block';
			}
			// show
			if (this.name === attributes.show) {
				element.style.display = isAttributeDefined(this.value) ? 'block' : 'none';
			}
			// checked
			if (this.name === attributes.checked) {
				renderSpecialAttribute(this.value, 'checked');
				element.checked = isAttributeDefined(this.value) ? true : false;
			}
			// disabled
			if (this.name === attributes.disabled) {
				renderSpecialAttribute(this.value, 'disabled');
			}
			// multiple
			if (this.name === attributes.multiple) {
				renderSpecialAttribute(this.value, 'multiple');
			}
			// readonly
			if (this.name === attributes.readonly) {
				if (ie === 7) {
					element.readOnly = isAttributeDefined(this.value) ? true : false;
				}
				else {
					renderSpecialAttribute(this.value, 'readonly');
				}
			}
			// selected
			if (this.name === attributes.selected) {
				renderSpecialAttribute(this.value, 'selected');
			}
		}
	};