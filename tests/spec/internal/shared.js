describe("internal - shared", function () {

	var scope, child, node, attr;

	beforeEach(function () {
		createContainer();
		createTemplate();
		scope = new Scope();
		child = scope._createChild();
		node = new Node(ct, scope);
		node.template = tpl;
		attr = new Attribute('class', 'bold', node, scope);
	});

	afterEach(function () {
		disposeTemplate();
		disposeContainer();
		node.dispose();
		node = null;
		scope = null;
	});

	it("getRepeaterData", function () {
		var scope = new Scope({items: [1, 2, 3]});
		var value = getRepeaterData('item in items', scope);
		expect(getRepeaterData('item in items', scope)).toEqual([1, 2, 3]);
	});

	it("updateScopeWithRepeaterData", function () {
		var scope = new Scope();
		updateScopeWithRepeaterData('item in items', scope, "item");
		expect(scope.item).toEqual('item');
	});

	it("getWatcherValue no watcher", function () {
		var exp = new Expression('val', node);
		var value = getWatcherValue(exp, 'value');
		expect(value).toEqual('value');
	});

	it("getWatcherValue watcher pattern", function () {
		tpl.watch('val', function() {
			return "watcherValue";
		});
		var exp = new Expression('val', node);
		var value = getWatcherValue(exp, 'value');
		expect(value).toEqual('watcherValue');
	});

	it("getWatcherValue watcher node", function () {
		tpl.watch(ct, function() {
			return "watcherValue";
		});
		var exp = new Expression('val', node);
		var value = getWatcherValue(exp, 'value');
		expect(value).toEqual('watcherValue');
	});

	it("getValue var", function () {
		scope.name = 'john';
		expect(getValue(scope, 'name', '', 'name', [], false, null)).toEqual('john');
		expect(getValue(child, 'name', '', 'name', [], false, null)).toEqual('john');
	});

	it("getValue var deep", function () {
		scope.d1 = {
			d2: {
				name: 'john'
			}
		};
		expect(getValue(scope, 'name', 'd1.d2', 'name', [], false, null)).toEqual('john');
		expect(getValue(child, 'name', 'd1.d2', 'name', [], false, null)).toEqual('john');
	});

	it("getValue function", function () {
		scope.name = function() {return 'john';};
		expect(getValue(scope, 'name', '', 'name', [], true, null)).toEqual('john');
		expect(getValue(child, 'name', '', 'name', [], true, null)).toEqual('john');
	});

	it("getValue function deep", function () {
		scope.d1 = {
			d2: {
				name: function() {return 'john';}
			}
		};
		expect(getValue(scope, 'name', 'd1.d2', 'name', [], true, null)).toEqual('john');
		expect(getValue(child, 'name', 'd1.d2', 'name', [], true, null)).toEqual('john');
	});

	it("getValue function param string", function () {
		scope.name = function(n, a) {return n + a;};
		expect(getValue(scope, 'name("john", "21")', '', 'name', ['"john"', '"21"'], true, null)).toEqual('john21');
		expect(getValue(child, 'name("john", "21")', '', 'name', ['"john"', '"21"'], true, null)).toEqual('john21');
	});

	it("getValue function deep param string", function () {
		scope.d1 = {
			d2: {
				name: function(n, a) {return n + a;}
			}
		};
		expect(getValue(scope, 'd1.d2.name("john", "21")', 'd1.d2', 'name', ['"john"', '"21"'], true, null)).toEqual('john21');
		expect(getValue(child, 'd1.d2.name("john", "21")', 'd1.d2', 'name', ['"john"', '"21"'], true, null)).toEqual('john21');
	});

	it("getValue function param var", function () {
		scope.n = 'john';
		scope.a = '21';
		scope.name = function(n, a) {return n + a;};
		expect(getValue(scope, 'name(n, a)', '', 'name', ['n', 'a'], true, null)).toEqual('john21');
		expect(getValue(child, 'name(n, a)', '', 'name', ['n', 'a'], true, null)).toEqual('john21');
	});

	it("getValue function deep param var", function () {
		scope.n = 'john';
		scope.a = '21';
		scope.d1 = {
			d2: {
				name: function(n, a) {return n + a;}
			}
		};
		expect(getValue(scope, 'd1.d2.name(n, a)', 'd1.d2', 'name', ['n', 'a'], true, null)).toEqual('john21');
		expect(getValue(child, 'd1.d2.name(n, a)', 'd1.d2', 'name', ['n', 'a'], true, null)).toEqual('john21');
	});

	it("getValue param in different scope (params in child)", function () {
		child.param1 = 'param1';
		child.param2 = 'param2';
		scope.func = function(p1, p2) {
			return p1 + p2;
		};
		expect(getValue(child, 'func(param1, param2)', '', 'func', ['param1', 'param2'], true, null)).toEqual('param1param2');
	});

	it("getValue param in different scope (params in parent)", function () {
		scope.param1 = 'param1';
		scope.param2 = 'param2';
		child.func = function(p1, p2) {
			return p1 + p2;
		};
		expect(getValue(child, 'func(param1, param2)', '', 'func', ['param1', 'param2'], true, null)).toEqual('param1param2');
	});

	it("getValue param in different scope (params in child) with function path", function () {
		child.param1 = 'param1';
		child.param2 = 'param2';
		scope.d1 = {
			func: function(p1, p2) {
				return p1 + p2;
			}
		}
		expect(getValue(child, 'd1.func(param1, param2)', 'd1', 'func', ['param1', 'param2'], true, null)).toEqual('param1param2');
	});

	it("getValue param in different scope (params in child) with params path", function () {
		child.p = {
			param1: 'param1',
			param2: 'param2'
		}
		scope.func = function(p1, p2) {
			return p1 + p2;
		}
		expect(getValue(child, 'func(p.param1, p.param2)', '', 'func', ['p.param1', 'p.param2'], true, null)).toEqual('param1param2');
	});

	it("getValue param in different scope (params in parent) with function path", function () {
		scope.param1 = 'param1';
		scope.param2 = 'param2';
		child.d1 = {
			func: function(p1, p2) {
				return p1 + p2;
			}
		}
		expect(getValue(child, 'd1.func(param1, param2)', 'd1', 'func', ['param1', 'param2'], true, null)).toEqual('param1param2');
	});

	it("getValue param in different scope (params in parent) with params path", function () {
		scope.p = {
			param1: 'param1',
			param2: 'param2'
		}
		child.func = function(p1, p2) {
			return p1 + p2;
		}
		expect(getValue(child, 'func(p.param1, p.param2)', '', 'func', ['p.param1', 'p.param2'], true, null)).toEqual('param1param2');
	});

	it("getValue param in different scope (params in child) with path", function () {
		child.p = {
			param1: 'param1',
			param2: 'param2'
		}
		scope.d1 = {
			func: function(p1, p2) {
				return p1 + p2;
			}
		}
		expect(getValue(child, 'd1.func(p.param1, p.param2)', 'd1', 'func', ['p.param1', 'p.param2'], true, null)).toEqual('param1param2');
	});

	it("getValue param in different scope (params in parent) with path", function () {
		scope.p = {
			param1: 'param1',
			param2: 'param2'
		}
		child.d1 = {
			func: function(p1, p2) {
				return p1 + p2;
			}
		}
		expect(getValue(child, 'd1.func(p.param1, p.param2)', 'd1', 'func', ['p.param1', 'p.param2'], true, null)).toEqual('param1param2');
	});

	it("TODO: MORE DEPTH GET VALUE TESTS", function() {
		expect(true).toBeFalsy();
	});

	it("getExpressionPath no path", function () {
		expect(getExpressionPath('func()')).toEqual('');
		expect(getExpressionPath('func(a1)')).toEqual('');
		expect(getExpressionPath('func(a1.a2)')).toEqual('');
	});

	it("getExpressionPath single", function () {
		expect(getExpressionPath('p1.func()')).toEqual('p1');
		expect(getExpressionPath('p1.func(a1)')).toEqual('p1');
		expect(getExpressionPath('p1.func(a1.a2)')).toEqual('p1');
	});

	it("getExpressionPath deep", function () {
		expect(getExpressionPath('p1.p2.func()')).toEqual('p1.p2');
		expect(getExpressionPath('p1.p2.func(a1)')).toEqual('p1.p2');
		expect(getExpressionPath('p1.p2.func(a1.a2)')).toEqual('p1.p2');
	});

	it("getExpressionAccessor no path", function () {
		expect(getExpressionAccessor('func()')).toEqual('func');
		expect(getExpressionAccessor('func(a1)')).toEqual('func');
		expect(getExpressionAccessor('func()')).toEqual('func');
	});

	it("getExpressionAccessor single", function () {
		expect(getExpressionAccessor('p1.func()')).toEqual('func');
		expect(getExpressionAccessor('p1.func(a1)')).toEqual('func');
		expect(getExpressionAccessor('p1.func(a1.a2)')).toEqual('func');
	});

	it("getExpressionAccessor deep", function () {
		expect(getExpressionAccessor('p1.p2.func()')).toEqual('func');
		expect(getExpressionAccessor('p1.p2.func(a1)')).toEqual('func');
		expect(getExpressionAccessor('p1.p2.func(a1.a2)')).toEqual('func');
	});

	it("getParamsFromString", function () {
		expect(getParamsFromString('')).toEqual([]);
		expect(getParamsFromString('a1')).toEqual(['a1']);
		expect(getParamsFromString('a1,a2')).toEqual(['a1', 'a2']);
		expect(getParamsFromString('a1, a2')).toEqual(['a1', 'a2']);
		expect(getParamsFromString('a1.a2,a3.a4')).toEqual(['a1.a2','a3.a4']);
		expect(getParamsFromString('a1.a2, a3.a4')).toEqual(['a1.a2', 'a3.a4']);
	});

	it("getNodeFromElement text", function () {
		ct.innerHTML = '{{cl}}';
		var node = getNodeFromElement(ct.firstChild);
		expect(node).toEqual(jasmine.any(Node));
		expect(node.element).toEqual(ct.firstChild);
		expect(node.attributes.length).toEqual(0);
		expect(node.value).toEqual('{{cl}}');
	});

	it("getNodeFromElement attribute", function () {
		ct.innerHTML = '<p class="{{cl}}"></p>';
		var node = getNodeFromElement(ct.firstChild);
		expect(node).toEqual(jasmine.any(Node));
		expect(node.element).toEqual(ct.firstChild);
		expect(node.attributes.length).toEqual(1);
		expect(node.attributes[0].name).toEqual('class');
		expect(node.attributes[0].value).toEqual('{{cl}}');
		expect(node.value).toBeNull();
	});

	it("hasInterpolation", function () {
		expect(hasInterpolation('a string')).toBeFalsy();
		expect(hasInterpolation('an {{interpolation}} string')).toBeTruthy();
	});

	it("hasContent", function () {
		expect(hasContent('')).toBeFalsy();
		expect(hasContent(' ')).toBeFalsy();
		expect(hasContent('	')).toBeFalsy();
		expect(hasContent('\n')).toBeFalsy();
		expect(hasContent('string')).toBeTruthy();
	});

	it("isElementValid", function () {
		expect(isElementValid('')).toBeFalsy();
		expect(isElementValid('string')).toBeFalsy();
		expect(isElementValid({})).toBeFalsy();
		expect(isElementValid(ct)).toBeTruthy();
		ct.innerHTML = "text";
		expect(isElementValid(ct.firstChild)).toBeTruthy();
	});

	it("compile", function () {
		ct.innerHTML = '<p class="{{cl}}">{{name}}</p>';
		var n = compile(tpl, ct, null, null);
		expect(n).toBeDefined();
		expect(n.template).toEqual(tpl);
		expect(n.children.length).toEqual(1);
		expect(n.children[0].attributes.length).toEqual(1);
		expect(n.children[0].attributes[0].name).toEqual('class');
		expect(n.children[0].attributes[0].value).toEqual('{{cl}}');
		expect(n.children[0].children[0].interpolation).toBeDefined();
		expect(n.children[0].children[0].interpolation.value).toEqual('{{name}}');
	});

	it("updateScopeWithData", function() {
		var scope = new Scope();
		updateScopeWithData(scope, {item: "string"});
		expect(scope.item).toEqual('string');
	});

	it("clearScope", function() {
		var scope = new Scope();
		scope.item = "string";
		clearScope(scope);
		expect(scope.item).toBeUndefined();
		expect(scope._parent).toBeNull();
		expect(scope._children).toEqual([]);
		expect(typeof scope._createChild).toEqual('function');
	});

	it("updateNodeChildren", function() {
		ct.innerHTML = '<p class="{{cl}}">{{name}}</p>';
		tpl.compile();
		tpl.scope.cl = "myClass";
		tpl.scope.name = "john";
		updateNodeChildren(tpl.node);
		expect(tpl.node.children[0].attributes[0].interpolationValue.render()).toEqual('myClass');
		expect(tpl.node.children[0].children[0].interpolation.render()).toEqual('john');
	});

	it("renderNodeChildren", function() {
		ct.innerHTML = '<p class="{{cl}}">{{name}}</p>';
		tpl.compile();
		tpl.scope.cl = "myClass";
		tpl.scope.name = "john";
		updateNodeChildren(tpl.node);
		renderNodeChildren(tpl.node);
		expect(tpl.node.children[0].attributes[0].value).toEqual('myClass');
		expect(tpl.node.children[0].children[0].value).toEqual('john');
	});

	it("renderNodeRepeater", function() {
		ct.innerHTML = '<p data-repeat="item in items">{{item}}</p>';
		tpl.compile();
		tpl.scope.items = [1, 2, 3];
		renderNodeRepeater(tpl.node.children[0]);
		expect(tpl.node.children[0].childrenRepeater[0].element.innerHTML).toEqual('1');
		expect(tpl.node.children[0].childrenRepeater[1].element.innerHTML).toEqual('2');
		expect(tpl.node.children[0].childrenRepeater[2].element.innerHTML).toEqual('3');
	});

	it("getScopeDepth", function() {
		expect(getScopeDepth('')).toEqual(0);
		expect(getScopeDepth('name')).toEqual(0);
		expect(getScopeDepth('func()')).toEqual(0);
		expect(getScopeDepth('../name')).toEqual(1);
		expect(getScopeDepth('../../name')).toEqual(2);
		expect(getScopeDepth('../../../name')).toEqual(3);
	});

	it("getScopeFromPattern", function() {
		var level1 = new Scope();
		var level2 = level1._createChild();
		var level3 = level2._createChild();
		expect(getScopeFromPattern(level1, 'name')).toEqual(level1);
		expect(getScopeFromPattern(level1, '../name')).toEqual(level1);
		expect(getScopeFromPattern(level1, '../../name')).toEqual(level1);
		expect(getScopeFromPattern(level2, 'name')).toEqual(level2);
		expect(getScopeFromPattern(level2, '../name')).toEqual(level1);
		expect(getScopeFromPattern(level2, '../../name')).toEqual(level1);
		expect(getScopeFromPattern(level3, 'name')).toEqual(level3);
		expect(getScopeFromPattern(level3, '../name')).toEqual(level2);
		expect(getScopeFromPattern(level3, '../../name')).toEqual(level1);
	});

	it("getParameterValue single", function() {
		var scope = new Scope();
		scope.name = 'john';
		expect(getParameterValue(scope, 'name')).toEqual('john');
	});

	it("getParameterValue deep", function() {
		var scope = new Scope();
		scope.d1 = {
			d2: {
				name: 'john'
			}
		};
		expect(getParameterValue(scope, 'd1.d2.name')).toEqual('john');
	});

	it("getParameterValue single parent", function() {
		var scope = new Scope();
		scope.name = 'john';
		var child = scope._createChild();
		expect(getParameterValue(child, 'name')).toEqual('john');
	});

	it("getParameterValue single depth", function() {
		var scope = new Scope();
		scope.name = 'john';
		var child = scope._createChild();
		child.name = 'david';
		expect(getParameterValue(child, '../name')).toEqual('john');
	});

	it("getParameterValue deep parent", function() {
		var scope = new Scope();
		scope.d1 = {
			d2: {
				name: 'john'
			}
		};
		var child = scope._createChild();
		expect(getParameterValue(child, 'd1.d2.name')).toEqual('john');
	});

	it("getParameterValue deep depth", function() {
		var scope = new Scope();
		scope.d1 = {
			d2: {
				name: 'john'
			}
		};
		var child = scope._createChild();
		child.d1 = {
			d2: {
				name: 'david'
			}
		};
		expect(getParameterValue(child, '../d1.d2.name')).toEqual('john');
	});

	it("getParameterValue string", function() {
		var scope = new Scope();
		expect(getParameterValue(scope, '"john"')).toEqual('john');
	});

});
