var templates = new HashMap();

var Template = function(element) {
	this.watchers = new HashMap();
	this.node = null;
	this.scope = null;
	this.compile(element);
};
Template.prototype = {
	toString: function() {
		return '[object Template]';
	},
	compile: function(element) {
		if (element) this.element = element;
		if (this.node) this.node.dispose();
		this.node = compile(this, this.element);
		this.node.root = true;
		this.scope = this.node.scope;
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
		if ( (!isString(target) && !isElement(target)) || !isFunction(watcher)) return;
		this.watchers.put(target, watcher);
	},
	unwatch: function(target) {
		this.watchers.remove(target);
	},
	clearWatchers: function() {
		this.watchers.dispose();
	},
	clearEvents: function() {
		this.node.clearEvents();
	},
	getNode: function(element) {
		return this.node.getNode(element);
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
