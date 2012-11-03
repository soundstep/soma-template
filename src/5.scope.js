var Scope = function(data) {
	function createChild(data) {
		var obj = createObject(data);
		obj._parent = this;
		this._children.push(obj);
		return obj;
	}
	function createObject(data) {
		var obj = {
			_parent: null,
			_children: [],
			_createChild: function(data) {
				return createChild.apply(obj, arguments);
			}
		};
		if (data && isObject(data)) {
			for (var i in data) {
				obj[i] = data[i];
			}
		}
		return obj;
	}
	return createObject(data);
};
