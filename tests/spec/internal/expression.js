describe("internal - expression", function () {

	var node, scope, attr;

	beforeEach(function () {
		createContainer();
		createTemplate();
		scope = new Scope();
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

	it("create expression", function () {
		var exp = new Expression('name', node);
		expect(exp).toEqual(jasmine.any(Expression));
		expect(exp.toString()).toEqual('[object Expression]');
	});

	it("parameters node value", function () {
		var exp = new Expression('name', node);
		expect(exp.pattern).toEqual('name');
		expect(exp.node).toEqual(node);
		expect(exp.attribute).toBeUndefined();
		expect(exp.isFunction).toBeFalsy();
		expect(exp.path).toEqual('name');
		expect(exp.params).toBeNull();
		expect(exp.value).toBeUndefined();
	});

	it("parameters attribute value", function () {
		var exp = new Expression('name', null, attr);
		expect(exp.pattern).toEqual('name');
		expect(exp.node).toBeNull();
		expect(exp.attribute).toEqual(attr);
		expect(exp.isFunction).toBeFalsy();
		expect(exp.path).toEqual('name');
		expect(exp.params).toBeNull();
		expect(exp.value).toBeUndefined();
	});

	it("function param string", function () {
		var exp = new Expression('name("john", "21")', node);
		expect(exp.isFunction).toBeTruthy();
		expect(exp.params).toEqual(['"john"', '"21"']);
	});

	it("function param var", function () {
		var exp = new Expression('name(john, 21)', node);
		expect(exp.isFunction).toBeTruthy();
		expect(exp.params).toEqual(['john', '21']);
	});

	it("value path", function () {
		var exp = new Expression('d1.name', node);
		expect(exp.isFunction).toBeFalsy();
		expect(exp.path).toEqual('d1.name');
	});

	it("value path deep", function () {
		var exp = new Expression('d1.d2.name', node);
		expect(exp.isFunction).toBeFalsy();
		expect(exp.path).toEqual('d1.d2.name');
	});

	it("function path param string", function () {
		var exp = new Expression('d1.name("john", "21")', node);
		expect(exp.isFunction).toBeTruthy();
		expect(exp.params).toEqual(['"john"', '"21"']);
		expect(exp.path).toEqual('d1.name');
	});

	it("function path deep param string", function () {
		var exp = new Expression('d1.d2.name("john", "21")', node);
		expect(exp.isFunction).toBeTruthy();
		expect(exp.params).toEqual(['"john"', '"21"']);
		expect(exp.path).toEqual('d1.d2.name');
	});

	it("function path param var", function () {
		var exp = new Expression('d1.name(john, 21)', node);
		expect(exp.isFunction).toBeTruthy();
		expect(exp.params).toEqual(['john', '21']);
		expect(exp.path).toEqual('d1.name');
	});

	it("function path deep param var", function () {
		var exp = new Expression('d1.d2.name(john, 21)', node);
		expect(exp.isFunction).toBeTruthy();
		expect(exp.params).toEqual(['john', '21']);
		expect(exp.path).toEqual('d1.d2.name');
	});

	it("function params string path", function () {
		var exp = new Expression('name("john.david", "21.22")', node);
		expect(exp.isFunction).toBeTruthy();
		expect(exp.params).toEqual(['"john.david"', '"21.22"']);
	});

	it("function params var path", function () {
		var exp = new Expression('name(john.david, 21.22)', node);
		expect(exp.isFunction).toBeTruthy();
		expect(exp.params).toEqual(['john.david', '21.22']);
	});

	it("function path params string path", function () {
		var exp = new Expression('d1.d2.name("john.david", "21.22")', node);
		expect(exp.isFunction).toBeTruthy();
		expect(exp.params).toEqual(['"john.david"', '"21.22"']);
		expect(exp.path).toEqual('d1.d2.name');
	});

	it("function params var path", function () {
		var exp = new Expression('d1.d2.name(john.david, 21.22)', node);
		expect(exp.isFunction).toBeTruthy();
		expect(exp.params).toEqual(['john.david', '21.22']);
		expect(exp.path).toEqual('d1.d2.name');
	});

	it("dispose", function () {
		var exp = new Expression('d1.d2.name(john.david, 21.22)', node);
		exp.dispose();
		expect(exp.pattern).toBeNull();
		expect(exp.node).toBeNull();
		expect(exp.attribute).toBeNull();
		expect(exp.path).toBeNull();
		expect(exp.params).toBeNull();
		expect(exp.value).toBeNull();
	});


});
