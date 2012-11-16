describe("internal - shared", function () {

	var scope, child, child2, node, attr;

	beforeEach(function () {
		createContainer();
		createTemplate();
		scope = new Scope();
		child = scope._createChild();
		child2 = child._createChild();
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

	it("getValue string", function () {
		expect(getValue(scope, '"name"', '', '"name"', [], false, null)).toEqual('name');
		expect(getValue(scope, "'name'", '', "'name'", [], false, null)).toEqual('name');
		expect(getValue(scope, '"func()"', '', '"name"', [], false, null)).toEqual('func()');
		expect(getValue(scope, "'func()'", '', "'name'", [], false, null)).toEqual('func()');
		expect(getValue(scope, '"func(n, a)"', '', '"name"', [], false, null)).toEqual('func(n, a)');
		expect(getValue(scope, "'func(n, a)'", '', "'name'", [], false, null)).toEqual("func(n, a)");
		expect(getValue(scope, '"func("n", "a")"', '', '"name"', [], false, null)).toEqual('func("n", "a")');
		expect(getValue(scope, "'func('n', 'a')'", '', "'name'", [], false, null)).toEqual("func('n', 'a')");
	});

	it("getValue var", function () {
		scope.name = 'john';
		expect(getValue(scope, 'name', '', 'name', [], false, null)).toEqual('john');
		expect(getValue(child, 'name', '', 'name', [], false, null)).toEqual('john');
	});

	it("getValue vard deph", function () {
		scope.name = 'john';
		child.name = 'david';
		child2.name = 'dan';
		expect(getValue(scope, 'name', '', 'name', [], false, null)).toEqual('john');
		expect(getValue(child, 'name', '', 'name', [], false, null)).toEqual('david');
		expect(getValue(child, '../name', '', 'name', [], false, null)).toEqual('john');
		expect(getValue(child2, 'name', '', 'name', [], false, null)).toEqual('dan');
		expect(getValue(child2, '../name', '', 'name', [], false, null)).toEqual('david');
		expect(getValue(child2, '../../name', '', 'name', [], false, null)).toEqual('john');
	});

	it("getValue var deep", function () {
		scope.d1 = { d2: { name: 'john' } };
		expect(getValue(scope, 'd1.d2name', 'd1.d2', 'name', [], false, null)).toEqual('john');
		expect(getValue(child, 'd1.d2name', 'd1.d2', 'name', [], false, null)).toEqual('john');
	});

	it("getValue var deep depth", function () {
		scope.d1 = { d2: { name: 'john' } };
		child.d1 = { d2: { name: 'david' } };
		child2.d1 = { d2: { name: 'dan' } };
		expect(getValue(scope, 'd1.d2.name', 'd1.d2', 'name', [], false, null)).toEqual('john');
		expect(getValue(child, 'd1.d2.name', 'd1.d2', 'name', [], false, null)).toEqual('david');
		expect(getValue(child, '../d1.d2.name', 'd1.d2', 'name', [], false, null)).toEqual('john');
		expect(getValue(child2, 'd1.d2.name', 'd1.d2', 'name', [], false, null)).toEqual('dan');
		expect(getValue(child2, '../d1.d2.name', 'd1.d2', 'name', [], false, null)).toEqual('david');
		expect(getValue(child2, '../../d1.d2.name', 'd1.d2', 'name', [], false, null)).toEqual('john');
	});

	it("getValue function", function () {
		scope.name = function() {return 'john';};
		expect(getValue(scope, 'name', '', 'name', [], true, null)).toEqual('john');
		expect(getValue(child, 'name', '', 'name', [], true, null)).toEqual('john');
	});

	it("getValue function depth", function () {
		scope.name = function() {return 'john';};
		child.name = function() {return 'david';};
		child2.name = function() {return 'dan';};
		expect(getValue(scope, 'name()', '', 'name', [], true, null)).toEqual('john');
		expect(getValue(child, 'name()', '', 'name', [], true, null)).toEqual('david');
		expect(getValue(child, '../name()', '', 'name', [], true, null)).toEqual('john');
		expect(getValue(child2, 'name()', '', 'name', [], true, null)).toEqual('dan');
		expect(getValue(child2, '../name()', '', 'name', [], true, null)).toEqual('david');
		expect(getValue(child2, '../../name()', '', 'name', [], true, null)).toEqual('john');
	});

	it("getValue function deep", function () {
		scope.d1 = { d2: { name: function() {return 'john';} } };
		expect(getValue(scope, 'd1.d2.name', 'd1.d2', 'name', [], true, null)).toEqual('john');
		expect(getValue(child, 'd1.d2.name', 'd1.d2', 'name', [], true, null)).toEqual('john');
	});

	it("getValue function deep depth", function () {
		scope.d1 = { d2: { name: function() {return 'john';} } };
		child.d1 = { d2: { name: function() {return 'david';} } };
		child2.d1 = { d2: { name: function() {return 'dan';} } };
		expect(getValue(scope, 'd1.d2.name()', 'd1.d2', 'name', [], true, null)).toEqual('john');
		expect(getValue(child, 'd1.d2.name()', 'd1.d2', 'name', [], true, null)).toEqual('david');
		expect(getValue(child, '../d1.d2.name()', 'd1.d2', 'name', [], true, null)).toEqual('john');
		expect(getValue(child2, 'd1.d2.name()', 'd1.d2', 'name', [], true, null)).toEqual('dan');
		expect(getValue(child2, '../d1.d2.name()', 'd1.d2', 'name', [], true, null)).toEqual('david');
		expect(getValue(child2, '../../d1.d2.name()', 'd1.d2', 'name', [], true, null)).toEqual('john');
	});

	it("getValue function param string", function () {
		scope.name = function(n, a) {return n + a;};
		expect(getValue(scope, 'name("john", "21")', '', 'name', ['"john"', '"21"'], true, null)).toEqual('john21');
		expect(getValue(child, 'name("john", "21")', '', 'name', ['"john"', '"21"'], true, null)).toEqual('john21');
	});

	it("getValue function param string depth", function () {
		scope.name = function(n, a) {return "A" + n + a;};
		child.name = function(n, a) {return "B" + n + a;};
		child2.name = function(n, a) {return "C" + n + a;};
		expect(getValue(scope, 'name("john", "21")', '', 'name', ['"john"', '"21"'], true, null)).toEqual('Ajohn21');
		expect(getValue(child, 'name("john", "21")', '', 'name', ['"john"', '"21"'], true, null)).toEqual('Bjohn21');
		expect(getValue(child, '../name("john", "21")', '', 'name', ['"john"', '"21"'], true, null)).toEqual('Ajohn21');
		expect(getValue(child2, 'name("john", "21")', '', 'name', ['"john"', '"21"'], true, null)).toEqual('Cjohn21');
		expect(getValue(child2, '../name("john", "21")', '', 'name', ['"john"', '"21"'], true, null)).toEqual('Bjohn21');
		expect(getValue(child2, '../../name("john", "21")', '', 'name', ['"john"', '"21"'], true, null)).toEqual('Ajohn21');
	});

	it("getValue function deep param string", function () {
		scope.d1 = { d2: { name: function(n, a) {return n + a;} } };
		expect(getValue(scope, 'd1.d2.name("john", "21")', 'd1.d2', 'name', ['"john"', '"21"'], true, null)).toEqual('john21');
		expect(getValue(child, 'd1.d2.name("john", "21")', 'd1.d2', 'name', ['"john"', '"21"'], true, null)).toEqual('john21');
	});

	it("getValue function deep param string depth", function () {
		scope.d1 = { d2: { name: function(n, a) {return "A" + n + a;} } };
		child.d1 = { d2: { name: function(n, a) {return "B" + n + a;} } };
		child2.d1 = { d2: { name: function(n, a) {return "C" + n + a;} } };
		expect(getValue(scope, 'd1.d2.name("john", "21")', 'd1.d2', 'name', ['"john"', '"21"'], true, null)).toEqual('Ajohn21');
		expect(getValue(child, 'd1.d2.name("john", "21")', 'd1.d2', 'name', ['"john"', '"21"'], true, null)).toEqual('Bjohn21');
		expect(getValue(child, '../d1.d2.name("john", "21")', 'd1.d2', 'name', ['"john"', '"21"'], true, null)).toEqual('Ajohn21');
		expect(getValue(child2, 'd1.d2.name("john", "21")', 'd1.d2', 'name', ['"john"', '"21"'], true, null)).toEqual('Cjohn21');
		expect(getValue(child2, '../d1.d2.name("john", "21")', 'd1.d2', 'name', ['"john"', '"21"'], true, null)).toEqual('Bjohn21');
		expect(getValue(child2, '../../d1.d2.name("john", "21")', 'd1.d2', 'name', ['"john"', '"21"'], true, null)).toEqual('Ajohn21');
	});

	it("getValue function param var", function () {
		scope.n = 'john';
		scope.a = '21';
		scope.name = function(n, a) {return n + a;};
		expect(getValue(scope, 'name(n, a)', '', 'name', ['n', 'a'], true, null)).toEqual('john21');
		expect(getValue(child, 'name(n, a)', '', 'name', ['n', 'a'], true, null)).toEqual('john21');
	});

	it("getValue function param var depth", function () {
		scope.n = 'john';
		scope.a = '21';
		child.n = 'david';
		child.a = '22';
		child2.n = 'dan';
		child2.a = '23';
		scope.name = function(n, a) {return "A" + n + a;};
		child.name = function(n, a) {return "B" + n + a;};
		child2.name = function(n, a) {return "C" + n + a;};
		expect(getValue(scope, 'name(n, a)', '', 'name', ['n', 'a'], true, null)).toEqual('Ajohn21');
		expect(getValue(child, 'name(n, a)', '', 'name', ['n', 'a'], true, null)).toEqual('Bdavid22');
		expect(getValue(child, '../name(n, a)', '', 'name', ['n', 'a'], true, null)).toEqual('Adavid22');
		expect(getValue(child, '../name(../n, ../a)', '', 'name', ['../n', '../a'], true, null)).toEqual('Ajohn21');
		expect(getValue(child2, 'name(n, a)', '', 'name', ['n', 'a'], true, null)).toEqual('Cdan23');
		expect(getValue(child2, '../name(n, a)', '', 'name', ['n', 'a'], true, null)).toEqual('Bdan23');
		expect(getValue(child2, '../name(../n, ../a)', '', 'name', ['../n', '../a'], true, null)).toEqual('Bdavid22');
		expect(getValue(child2, '../../name(n, a)', '', 'name', ['n', 'a'], true, null)).toEqual('Adan23');
		expect(getValue(child2, '../../name(../n, ../a)', '', 'name', ['../n', '../a'], true, null)).toEqual('Adavid22');
		expect(getValue(child2, '../../name(../../n, ../../a)', '', 'name', ['../../n', '../../a'], true, null)).toEqual('Ajohn21');
	});

	it("getValue function deep param var", function () {
		scope.n = 'john';
		scope.a = '21';
		scope.d1 = { d2: { name: function(n, a) {return n + a;} } };
		expect(getValue(scope, 'd1.d2.name(n, a)', 'd1.d2', 'name', ['n', 'a'], true, null)).toEqual('john21');
		expect(getValue(child, 'd1.d2.name(n, a)', 'd1.d2', 'name', ['n', 'a'], true, null)).toEqual('john21');
	});

	it("getValue function deep param var depth", function () {
		scope.n = 'john';
		scope.a = '21';
		scope.d1 = { d2: { name: function(n, a) {return "A" + n + a;} } };
		child.n = 'david';
		child.a = '22';
		child.d1 = { d2: { name: function(n, a) {return "B" + n + a;} } };
		child2.n = 'dan';
		child2.a = '23';
		child2.d1 = { d2: { name: function(n, a) {return "C" + n + a;} } };
		expect(getValue(scope, 'd1.d2.name(n, a)', 'd1.d2', 'name', ['n', 'a'], true, null)).toEqual('Ajohn21');
		expect(getValue(child, 'd1.d2.name(n, a)', 'd1.d2', 'name', ['n', 'a'], true, null)).toEqual('Bdavid22');
		expect(getValue(child, '../d1.d2.name(n, a)', 'd1.d2', 'name', ['n', 'a'], true, null)).toEqual('Adavid22');
		expect(getValue(child, '../d1.d2.name(../n, ../a)', 'd1.d2', 'name', ['../n', '../a'], true, null)).toEqual('Ajohn21');
		expect(getValue(child2, 'd1.d2.name(n, a)', 'd1.d2', 'name', ['n', 'a'], true, null)).toEqual('Cdan23');
		expect(getValue(child2, '../d1.d2.name(n, a)', 'd1.d2', 'name', ['n', 'a'], true, null)).toEqual('Bdan23');
		expect(getValue(child2, '../d1.d2.name(../n, ../a)', 'd1.d2', 'name', ['../n', '../a'], true, null)).toEqual('Bdavid22');
		expect(getValue(child2, '../../d1.d2.name(n, a)', 'd1.d2', 'name', ['n', 'a'], true, null)).toEqual('Adan23');
		expect(getValue(child2, '../../d1.d2.name(../n, ../a)', 'd1.d2', 'name', ['../n', '../a'], true, null)).toEqual('Adavid22');
		expect(getValue(child2, '../../d1.d2.name(../../n, ../../a)', 'd1.d2', 'name', ['../../n', '../../a'], true, null)).toEqual('Ajohn21');
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

	it("getValue array", function() {
		scope.names = ['john', 'david', 'mike'];
		scope.names[100] = 'olivia';
		expect(getValue(scope, 'names[0]', '', 'names[0]', [''], false, null)).toEqual('john');
		expect(getValue(scope, 'names[1]', '', 'names[1]', [''], false, null)).toEqual('david');
		expect(getValue(scope, 'names[2]', '', 'names[2]', [''], false, null)).toEqual('mike');
		expect(getValue(scope, 'names[100]', '', 'names[100]', [''], false, null)).toEqual('olivia');
		expect(getValue(scope, 'names[3]', '', 'names[3]', [''], false, null)).toBeUndefined();
	});

	it("getValue array param", function() {
		scope.names = ['john', 'david', 'mike'];
		scope.names[100] = 'olivia';
		scope.func = function(value) {
			return !value ? null : "My name is " + value;
		}
		expect(getValue(scope, 'func(names[0])', '', 'func', ['names[0]'], true, null)).toEqual('My name is john');
		expect(getValue(scope, 'func(names[1])', '', 'func', ['names[1]'], true, null)).toEqual('My name is david');
		expect(getValue(scope, 'func(names[2])', '', 'func', ['names[2]'], true, null)).toEqual('My name is mike');
		expect(getValue(scope, 'func(names[100])', '', 'func', ['names[100]'], true, null)).toEqual('My name is olivia');
		expect(getValue(scope, 'func(names[3])', '', 'func', ['names[3]'], true, null)).toBeNull();
	});

	it("getValue array from child", function() {
		scope.names = ['john', 'david', 'mike'];
		scope.names[100] = 'olivia';
		expect(getValue(child, 'names[0]', '', 'names[0]', [''], false, null)).toEqual('john');
		expect(getValue(child, 'names[1]', '', 'names[1]', [''], false, null)).toEqual('david');
		expect(getValue(child, 'names[2]', '', 'names[2]', [''], false, null)).toEqual('mike');
		expect(getValue(child, 'names[100]', '', 'names[100]', [''], false, null)).toEqual('olivia');
		expect(getValue(child, 'names[3]', '', 'names[3]', [''], false, null)).toBeUndefined();
	});

	it("getValue array param from child", function() {
		scope.names = ['john', 'david', 'mike'];
		scope.names[100] = 'olivia';
		scope.func = function(value) {
			return !value ? null : "My name is " + value;
		}
		expect(getValue(child, 'func(names[0])', '', 'func', ['names[0]'], true, null)).toEqual('My name is john');
		expect(getValue(child, 'func(names[1])', '', 'func', ['names[1]'], true, null)).toEqual('My name is david');
		expect(getValue(child, 'func(names[2])', '', 'func', ['names[2]'], true, null)).toEqual('My name is mike');
		expect(getValue(child, 'func(names[100])', '', 'func', ['names[100]'], true, null)).toEqual('My name is olivia');
		expect(getValue(child, 'func(names[3])', '', 'func', ['names[3]'], true, null)).toBeNull();
	});

	it("getValue array from child with parent string", function() {
		scope.names = ['john', 'david', 'mike'];
		scope.names[100] = 'olivia';
		expect(getValue(child, '../names[0]', '', 'names[0]', [''], false, null)).toEqual('john');
		expect(getValue(child, '../names[1]', '', 'names[1]', [''], false, null)).toEqual('david');
		expect(getValue(child, '../names[2]', '', 'names[2]', [''], false, null)).toEqual('mike');
		expect(getValue(child, '../names[100]', '', 'names[100]', [''], false, null)).toEqual('olivia');
		expect(getValue(child, '../names[3]', '', 'names[3]', [''], false, null)).toBeUndefined();
	});

	it("getValue array param from child with parent string", function() {
		scope.names = ['john', 'david', 'mike'];
		scope.names[100] = 'olivia';
		scope.func = function(value) {
			return !value ? null : "My name is " + value;
		}
		expect(getValue(child, 'func(../names[0])', '', 'func', ['../names[0]'], true, null)).toEqual('My name is john');
		expect(getValue(child, 'func(../names[1])', '', 'func', ['../names[1]'], true, null)).toEqual('My name is david');
		expect(getValue(child, 'func(../names[2])', '', 'func', ['../names[2]'], true, null)).toEqual('My name is mike');
		expect(getValue(child, 'func(../names[100])', '', 'func', ['../names[100]'], true, null)).toEqual('My name is olivia');
		expect(getValue(child, 'func(../names[3])', '', 'func', ['../names[3]'], true, null)).toBeNull();
	});

	it("getValue array path", function() {
		scope.section = {
			names: ['john', 'david', 'mike']
		};
		scope.section.names[100] = 'olivia';
		expect(getValue(scope, 'section.names[0]', 'section', 'names[0]', [''], false, null)).toEqual('john');
		expect(getValue(scope, 'section.names[1]', 'section', 'names[1]', [''], false, null)).toEqual('david');
		expect(getValue(scope, 'section.names[2]', 'section', 'names[2]', [''], false, null)).toEqual('mike');
		expect(getValue(scope, 'section.names[100]', 'section', 'names[100]', [''], false, null)).toEqual('olivia');
		expect(getValue(scope, 'section.names[3]', 'section', 'names[3]', [''], false, null)).toBeUndefined();
	});

	it("getValue array path param", function() {
		scope.section = {
			names: ['john', 'david', 'mike']
		};
		scope.section.names[100] = 'olivia';
		scope.section.func = function(value) {
			return !value ? null : "My name is " + value;
		}
		expect(getValue(scope, 'section.func(section.names[0])', 'section', 'func', ['section.names[0]'], true, null)).toEqual('My name is john');
		expect(getValue(scope, 'section.func(section.names[1])', 'section', 'func', ['section.names[1]'], true, null)).toEqual('My name is david');
		expect(getValue(scope, 'section.func(section.names[2])', 'section', 'func', ['section.names[2]'], true, null)).toEqual('My name is mike');
		expect(getValue(scope, 'section.func(section.names[100])', 'section', 'func', ['section.names[100]'], true, null)).toEqual('My name is olivia');
		expect(getValue(scope, 'section.func(section.names[3])', 'section', 'func', ['section.names[3]'], true, null)).toBeNull();
	});

	it("getValue array path from child", function() {
		scope.section = {
			names: ['john', 'david', 'mike']
		};
		scope.section.names[100] = 'olivia';
		expect(getValue(child, 'section.names[0]', 'section', 'names[0]', [''], false, null)).toEqual('john');
		expect(getValue(child, 'section.names[1]', 'section', 'names[1]', [''], false, null)).toEqual('david');
		expect(getValue(child, 'section.names[2]', 'section', 'names[2]', [''], false, null)).toEqual('mike');
		expect(getValue(child, 'section.names[100]', 'section', 'names[100]', [''], false, null)).toEqual('olivia');
		expect(getValue(child, 'section.names[3]', 'section', 'names[3]', [''], false, null)).toBeUndefined();
	});

	it("getValue array path param from child", function() {
		scope.section = {
			names: ['john', 'david', 'mike']
		};
		scope.section.names[100] = 'olivia';
		scope.section.func = function(value) {
			return !value ? null : "My name is " + value;
		}
		expect(getValue(child, 'section.func(section.names[0])', 'section', 'func', ['section.names[0]'], true, null)).toEqual('My name is john');
		expect(getValue(child, 'section.func(section.names[1])', 'section', 'func', ['section.names[1]'], true, null)).toEqual('My name is david');
		expect(getValue(child, 'section.func(section.names[2])', 'section', 'func', ['section.names[2]'], true, null)).toEqual('My name is mike');
		expect(getValue(child, 'section.func(section.names[100])', 'section', 'func', ['section.names[100]'], true, null)).toEqual('My name is olivia');
		expect(getValue(child, 'section.func(section.names[3])', 'section', 'func', ['section.names[3]'], true, null)).toBeNull();
	});

	it("getValue array path from child with parent string", function() {
		scope.section = {
			names: ['john', 'david', 'mike']
		};
		scope.section.names[100] = 'olivia';
		expect(getValue(child, '../section.names[0]', 'section', 'names[0]', [''], false, null)).toEqual('john');
		expect(getValue(child, '../section.names[1]', 'section', 'names[1]', [''], false, null)).toEqual('david');
		expect(getValue(child, '../section.names[2]', 'section', 'names[2]', [''], false, null)).toEqual('mike');
		expect(getValue(child, '../section.names[100]', 'section', 'names[100]', [''], false, null)).toEqual('olivia');
		expect(getValue(child, '../section.names[3]', 'section', 'names[3]', [''], false, null)).toBeUndefined();
	});

	it("getValue array path param from child", function() {
		scope.section = {
			names: ['john', 'david', 'mike']
		};
		scope.section.names[100] = 'olivia';
		scope.section.func = function(value) {
			return !value ? null : "My name is " + value;
		}
		expect(getValue(child, '../section.func(../section.names[0])', 'section', 'func', ['../section.names[0]'], true, null)).toEqual('My name is john');
		expect(getValue(child, '../section.func(../section.names[0])', 'section', 'func', ['../section.names[0]'], true, null)).toEqual('My name is john');
		expect(getValue(child, '../section.func(../section.names[1])', 'section', 'func', ['../section.names[1]'], true, null)).toEqual('My name is david');
		expect(getValue(child, '../section.func(../section.names[2])', 'section', 'func', ['../section.names[2]'], true, null)).toEqual('My name is mike');
		expect(getValue(child, '../section.func(../section.names[100])', 'section', 'func', ['../section.names[100]'], true, null)).toEqual('My name is olivia');
		expect(getValue(child, '../section.func(../section.names[3])', 'section', 'func', ['../section.names[3]'], true, null)).toBeNull();
	});

	it("getExpArrayParts", function() {
		expect(getExpArrayParts('')).toBeNull();
		expect(getExpArrayParts('name')).toBeNull();
		expect(getExpArrayParts('name[]')).toBeNull();
		expect(getExpArrayParts('name[0]')).toEqual(['name', '0'])
		expect(getExpArrayParts('name[999]')).toEqual(['name', '999'])
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

	it("renderNodeRepeater array", function() {
		ct.innerHTML = '<p data-repeat="item in items">{{$index}}-{{item}}</p>';
		tpl.compile();
		tpl.scope.items = [1, 2, 3];
		renderNodeRepeater(tpl.node.children[0]);
		expect(tpl.node.children[0].childrenRepeater[0].element.innerHTML).toEqual('0-1');
		expect(tpl.node.children[0].childrenRepeater[1].element.innerHTML).toEqual('1-2');
		expect(tpl.node.children[0].childrenRepeater[2].element.innerHTML).toEqual('2-3');
	});

	it("renderNodeRepeater object", function() {
		ct.innerHTML = '<p data-repeat="item in items">{{$key}}-{{item}}</p>';
		tpl.compile();
		tpl.scope.items = {item1:1, item2:2, item3:3};
		renderNodeRepeater(tpl.node.children[0]);
		expect(tpl.node.children[0].childrenRepeater[0].element.innerHTML).toEqual('item1-1');
		expect(tpl.node.children[0].childrenRepeater[1].element.innerHTML).toEqual('item2-2');
		expect(tpl.node.children[0].childrenRepeater[2].element.innerHTML).toEqual('item3-3');
	});

	it("createRepeaterChild array", function() {
		ct.innerHTML = '<p data-repeat="item in items">{{$index}}-{{item}}</p>';
		tpl.compile();
		tpl.scope.items = [1, 2, 3];
		var data = getRepeaterData(tpl.node.children[0].repeater, tpl.node.children[0].scope);
		createRepeaterChild(tpl.node.children[0], 0, data[0], vars.index, 0, null);
		createRepeaterChild(tpl.node.children[0], 1, data[1], vars.index, 1, null);
		createRepeaterChild(tpl.node.children[0], 2, data[2], vars.index, 2, null);
		expect(tpl.node.children[0].childrenRepeater[0].element.innerHTML).toEqual('0-1');
		expect(tpl.node.children[0].childrenRepeater[1].element.innerHTML).toEqual('1-2');
		expect(tpl.node.children[0].childrenRepeater[2].element.innerHTML).toEqual('2-3');
		expect(tpl.node.children[0].childrenRepeater[0].parent).toEqual(tpl.node);
		expect(tpl.node.children[0].childrenRepeater[1].parent).toEqual(tpl.node);
		expect(tpl.node.children[0].childrenRepeater[2].parent).toEqual(tpl.node);
	});

	it("createRepeaterChild object", function() {
		ct.innerHTML = '<p data-repeat="item in items">{{$key}}-{{item}}</p>';
		tpl.compile();
		tpl.scope.items = {item1:1, item2:2, item3:3};
		var data = getRepeaterData(tpl.node.children[0].repeater, tpl.node.children[0].scope);
		createRepeaterChild(tpl.node.children[0], 0, data.item1, vars.key, "item1", null);
		createRepeaterChild(tpl.node.children[0], 1, data.item2, vars.key, "item2", null);
		createRepeaterChild(tpl.node.children[0], 2, data.item3, vars.key, "item3", null);
		expect(tpl.node.children[0].childrenRepeater[0].element.innerHTML).toEqual('item1-1');
		expect(tpl.node.children[0].childrenRepeater[1].element.innerHTML).toEqual('item2-2');
		expect(tpl.node.children[0].childrenRepeater[2].element.innerHTML).toEqual('item3-3');
		expect(tpl.node.children[0].childrenRepeater[0].parent).toEqual(tpl.node);
		expect(tpl.node.children[0].childrenRepeater[1].parent).toEqual(tpl.node);
		expect(tpl.node.children[0].childrenRepeater[2].parent).toEqual(tpl.node);
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

	it("getValueFromPattern single", function() {
		var scope = new Scope();
		scope.name = 'john';
		expect(getValueFromPattern(scope, 'name')).toEqual('john');
	});

	it("getValueFromPattern deep", function() {
		var scope = new Scope();
		scope.d1 = {
			d2: {
				name: 'john'
			}
		};
		expect(getValueFromPattern(scope, 'd1.d2.name')).toEqual('john');
	});

	it("getValueFromPattern single parent", function() {
		var scope = new Scope();
		scope.name = 'john';
		var child = scope._createChild();
		expect(getValueFromPattern(child, 'name')).toEqual('john');
	});

	it("getValueFromPattern single depth", function() {
		var scope = new Scope();
		scope.name = 'john';
		var child = scope._createChild();
		child.name = 'david';
		expect(getValueFromPattern(child, '../name')).toEqual('john');
	});

	it("getValueFromPattern deep parent", function() {
		var scope = new Scope();
		scope.d1 = {
			d2: {
				name: 'john'
			}
		};
		var child = scope._createChild();
		expect(getValueFromPattern(child, 'd1.d2.name')).toEqual('john');
	});

	it("getValueFromPattern deep depth", function() {
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
		expect(getValueFromPattern(child, '../d1.d2.name')).toEqual('john');
	});

	it("getValueFromPattern string", function() {
		var scope = new Scope();
		expect(getValueFromPattern(scope, '"john"')).toEqual('john');
	});

});
