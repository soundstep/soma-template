describe("internal - attribute", function () {

	beforeEach(function () {
		createContainer();
		createTemplate();
	});

	afterEach(function () {
		disposeTemplate();
		disposeContainer();
	});

	it("create attribute", function () {
		var scope = new Scope();
		var attr = new Attribute('class', 'bold', new Node(ct, scope), scope);
		expect(attr).toEqual(jasmine.any(Attribute));
		expect(attr.toString()).toEqual('[object Attribute]');
	});

	it("attribute parameters", function () {
		var scope = new Scope();
		var node = new Node(ct, scope);
		var attr = new Attribute('class', 'bold', node, scope);
		expect(attr.name).toEqual('class');
		expect(attr.value).toEqual('bold');
		expect(attr.node).toEqual(node);
		expect(attr.invalidate).toBeFalsy();
		expect(attr.interpolationName).toBeDefined();
		expect(attr.interpolationName).not.toBeNull();
		expect(attr.interpolationName).toEqual(jasmine.any(Interpolation));
		expect(attr.interpolationValue).toBeDefined();
		expect(attr.interpolationValue).not.toBeNull();
		expect(attr.interpolationValue).toEqual(jasmine.any(Interpolation));
	});

});
