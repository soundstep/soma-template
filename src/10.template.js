var templates = new HashMap();

var Template = function(element) {
	this.watchers = new HashMap();
	this.element = element;
	this.node;
	this.compile();
};
Template.prototype = {
	toString: function() {
		return '[object Template]';
	},
	compile: function() {
		this.node = compile(this, this.element);
	},
	update: function(data) {
		if (isDefined(data)) updateScopeWithData(this.node.scope, data);
		if (this.node) this.node.update();
	},
	render: function(data) {
		this.update(data);
		if (this.node) this.node.render();
	},
	invalidate: function() {
		if (this.node) this.node.invalidateData();
	},
	watch: function(target, watcher) {
		if (!isString(target) && !isElement(target)) return;
		this.watchers.put(target, watcher);
	},
	dispose: function() {
		templates.remove(this.element);
		if (this.watchers) {
			this.watchers.dispose();
		}
		if (this.node) {
			this.node.dispose();
		}
		this.element = null;
		this.watchers = null;
		this.node = null;
	}
};
