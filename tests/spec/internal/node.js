describe("internal - node", function () {

	beforeEach(function () {

	});

	afterEach(function () {

	});

	it("create node", function () {
		var node = new Node();
		expect(node).toEqual(jasmine.any(Node));
		expect(node.toString()).toEqual('[object Node]');
	});

	it("node parameters", function () {
		var scope = new Scope();
		var node = new Node(ct, scope);
		expect(node.element).toEqual(ct);
		expect(node.scope).toEqual(scope);
	});

});
