describe("internal - interpolation", function () {

	var node, scope, int, attr;

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

	it("create interpolation", function () {
		var int = new Interpolation('name:{{name}}', node);
		expect(int).toEqual(jasmine.any(Interpolation));
		expect(int.toString()).toEqual('[object Interpolation]');
	});

	it("node parameters", function () {
		var int = new Interpolation('name:{{name}}', node);
		expect(int.value).toEqual('name:{{name}}');
		expect(int.node).toEqual(node);
		expect(int.attribute).toBeUndefined();
		expect(int.sequence.length).toEqual(2);
		expect(int.sequence[0]).toEqual('name:');
		expect(int.sequence[1]).toEqual(jasmine.any(Expression));
		expect(int.expressions.length).toEqual(1);
		expect(int.expressions[0]).toEqual(jasmine.any(Expression));
	});

	it("attribute parameters", function () {
		var int = new Interpolation('name:{{name}}', null, attr);
		expect(int.value).toEqual('name:{{name}}');
		expect(int.attribute).toEqual(attr);
		expect(int.node).toBeNull();
		expect(int.sequence.length).toEqual(2);
		expect(int.sequence[0]).toEqual('name:');
		expect(int.sequence[1]).toEqual(jasmine.any(Expression));
		expect(int.expressions.length).toEqual(1);
		expect(int.expressions[0]).toEqual(jasmine.any(Expression));
	});

	it("no expression", function () {
		var int = new Interpolation('string', null, null);
		expect(int.value).toEqual('string');
		expect(int.sequence.length).toEqual(1);
		expect(int.sequence[0]).toEqual('string');
		expect(int.expressions.length).toEqual(0);
	});

	it("render no expression", function () {
		var int = new Interpolation('string', null, null);
		int.update();
		expect(int.value).toEqual('string');
	});

	it("render single expression", function () {
		var int = new Interpolation('{{name}}', node, null);
		scope.name = 'john';
		int.update();
		expect(int.render()).toEqual('john');
	});

	it("render multiple expression", function () {
		var int = new Interpolation('{{name}}{{age}}{{genre}}', node, null);
		scope.name = 'john';
		scope.age = 21;
		scope.genre = 'male';
		int.update();
		expect(int.render()).toEqual('john21male');
	});

	it("render single expression with prefix", function () {
		var int = new Interpolation('name: {{name}}', node, null);
		scope.name = 'john';
		int.update();
		expect(int.render()).toEqual('name: john');
	});

	it("render multiple expressions with prefix", function () {
		var int = new Interpolation('name: {{name}}, age: {{age}}, genre: {{genre}}.', node, null);
		scope.name = 'john';
		scope.age = 21;
		scope.genre = 'male';
		int.update();
		expect(int.render()).toEqual('name: john, age: 21, genre: male.');
	});

	it("render single expression with suffix", function () {
		var int = new Interpolation('{{name}} is my name.', node, null);
		scope.name = 'john';
		int.update();
		expect(int.render()).toEqual('john is my name.');
	});

	it("render multiple expression with suffix", function () {
		var int = new Interpolation('{{name}} is my name, {{age}} is my age, {{genre}} is my genre.', node, null);
		scope.name = 'john';
		scope.age = 21;
		scope.genre = 'male';
		int.update();
		expect(int.render()).toEqual('john is my name, 21 is my age, male is my genre.');
	});

	it("dispose", function () {
		var int = new Interpolation('{{name}} is my name, {{age}} is my age, {{genre}} is my genre.', node, null);
		int.dispose();
		expect(int.value).toBeNull();
		expect(int.node).toBeNull();
		expect(int.attribute).toBeNull();
		expect(int.sequence).toBeNull();
		expect(int.expressions).toBeNull();
	});

});
