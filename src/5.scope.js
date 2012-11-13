var Scope = function(data) {
	function createChild(data) {
		var obj = createObject(data);
		obj._parent = this;
		this._children.push(obj);
		return obj;
	}
	function createObject(data) {
		var obj = data || {};
		obj._parent = null;
		obj._children = [];
		obj._createChild = function(data) {
			return createChild.apply(obj, arguments);
		}
		return obj;
	}
	return createObject(data);
};
