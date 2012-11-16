describe("api - watchers", function () {

	beforeEach(function () {
		createContainer();
		createTemplate();
	});

	afterEach(function () {
		disposeTemplate();
		disposeContainer();
	});

	it("add pattern watcher", function () {
		ct.innerHTML = '<span {{name}}="{{name}}">{{name}}</span>';
		tpl.compile(ct);
		tpl.scope.name = 'john';
		var watcherExecuted = 0;
		tpl.watch('name', function() {
			watcherExecuted++;
			return 'david';
		});
		tpl.render();
		expect(tpl.watchers.get('name')).toBeDefined();
		expect(watcherExecuted).toEqual(3);
		expect(ct.firstChild.getAttribute('david')).toEqual('david');
		expect(ct.firstChild.innerHTML).toEqual('david');
	});

	it("add node watcher", function () {
		ct.innerHTML = '<span {{name}}="{{name}}">{{name}}</span>';
		tpl.compile(ct);
		tpl.scope.name = 'john';
		var watcherExecuted = 0;
		tpl.watch(ct.firstChild, function() {
			watcherExecuted++;
			return 'david';
		});
		tpl.render();
		expect(tpl.watchers.get(ct.firstChild)).toBeDefined();
		expect(watcherExecuted).toEqual(3);
		expect(ct.firstChild.getAttribute('david')).toEqual('david');
		expect(ct.firstChild.innerHTML).toEqual('david');
	});

	it("add text node watcher", function () {
		ct.innerHTML = '<span {{name}}="{{name}}">{{name}}</span>';
		tpl.compile(ct);
		tpl.scope.name = 'john';
		var watcherExecuted = 0;
		tpl.watch(ct.firstChild.firstChild, function() {
			watcherExecuted++;
			return 'david';
		});
		tpl.render();
		expect(tpl.watchers.get(ct.firstChild.firstChild)).toBeDefined();
		expect(watcherExecuted).toEqual(1);
		expect(ct.firstChild.getAttribute('john')).toEqual('john');
		expect(ct.firstChild.innerHTML).toEqual('david');
	});

	it("remove pattern watcher", function () {
		ct.innerHTML = '{{name}}';
		tpl.compile(ct);
		tpl.scope.name = 'john';
		var watcherExecuted = 0;
		tpl.watch('name', function() {
			watcherExecuted++;
			return 'david';
		});
		tpl.unwatch('name');
		tpl.render();
		expect(tpl.watchers.get('name')).toBeUndefined();
		expect(watcherExecuted).toEqual(0);
		expect(ct.innerHTML).toEqual('john');
	});

	it("remove node watcher", function () {
		ct.innerHTML = '<span {{name}}="{{name}}">{{name}}</span>';
		tpl.compile(ct);
		tpl.scope.name = 'john';
		var watcherExecuted = 0;
		tpl.watch(ct.firstChild, function() {
			watcherExecuted++;
			return 'david';
		});
		tpl.unwatch(ct.firstChild);
		tpl.render();
		expect(tpl.watchers.get(ct.firstChild)).toBeUndefined();
		expect(watcherExecuted).toEqual(0);
		expect(ct.firstChild.getAttribute('john')).toEqual('john');
		expect(ct.firstChild.innerHTML).toEqual('john');
	});

	it("clear watcher", function () {
		ct.innerHTML = '{{name}} {{age}}';
		tpl.compile(ct);
		tpl.scope.name = 'john';
		tpl.scope.age = 21;
		var watcherExecuted = 0;
		tpl.watch('name', function() {
			watcherExecuted++;
			return 'value';
		});
		tpl.watch(ct.firstChild, function() {
			watcherExecuted++;
			return 'value';
		});
		tpl.clearWatchers();
		tpl.render();
		expect(tpl.watchers.get('name')).toBeUndefined();
		expect(tpl.watchers.get(ct.firstChild)).toBeUndefined();
		expect(watcherExecuted).toEqual(0);
		expect(ct.innerHTML).toEqual('john 21');
	});

	it("watcher no function", function () {
		ct.innerHTML = '{{name}} {{age}}';
		tpl.compile(ct);
		tpl.scope.name = 'john';
		tpl.scope.age = 21;
		tpl.watch('name');
		tpl.render();
		tpl.watch('age', 'not a function');
		tpl.render();
		expect(tpl.watchers.get('name')).toBeUndefined();
		expect(tpl.watchers.get('age')).toBeUndefined();
		expect(ct.innerHTML).toEqual('john 21');
	});

	it("watcher no return", function () {
		ct.innerHTML = '{{name}}';
		tpl.compile(ct);
		tpl.scope.name = 'john';
		var watcherExecuted = 0;
		tpl.watch('name', function() {
			watcherExecuted++;
		});
		tpl.render();
		expect(tpl.watchers.get('name')).toBeDefined();
		expect(watcherExecuted).toEqual(1);
		expect(ct.innerHTML).toEqual('john');
	});

	it("watcher node params", function () {
		ct.innerHTML = '{{name}}';
		tpl.compile(ct);
		tpl.scope.name = 'john';
		tpl.watch(ct.firstChild, function(oldValue, newValue, pattern, scope, node, attribute) {
			expect(oldValue).toBeUndefined();
			expect(newValue).toEqual('john');
			expect(pattern).toEqual('name');
			expect(scope).not.toBeNull();
			expect(scope.name).toEqual('john');
			expect(node).not.toBeNull();
			expect(node.element).toEqual(ct.firstChild);
			expect(attribute).toBeUndefined();
		});
		tpl.render();
	});

	it("watcher attribute params", function () {
		ct.innerHTML = '<p {{name}}="{{name}}"></p>';
		tpl.compile(ct);
		tpl.scope.name = 'john';
		tpl.watch(ct.firstChild, function(oldValue, newValue, pattern, scope, node, attribute) {
			expect(oldValue).toBeUndefined();
			expect(newValue).toEqual('john');
			expect(pattern).toEqual('name');
			expect(scope).not.toBeNull();
			expect(scope.name).toEqual('john');
			expect(node).not.toBeNull();
			expect(node.element).toEqual(ct.firstChild);
			expect(attribute).toBeDefined();
			expect(attribute.name).toEqual('{{name}}');
			expect(attribute.value).toEqual('{{name}}');
		});
		tpl.render();
	});

});
