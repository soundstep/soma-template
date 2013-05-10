	var Scope = function(data) {
		var self;
		function createChild(data) {
			var obj = createObject(data);
			obj._parent = self;
			self._children.push(obj);
			return obj;
		}
		function createObject(data) {
			var obj = data || {};
			obj._parent = null;
			obj._children = [];
			obj._createChild = function() {
				self = obj;
				return createChild.apply(obj, arguments);
			};
			return obj;
		}
		return createObject(data);
	};