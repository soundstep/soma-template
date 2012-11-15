describe("api - scope", function () {

	beforeEach(function () {
		createContainer();
		createTemplate();
	});

	afterEach(function () {
		disposeTemplate();
		disposeContainer();
	});

	it("root scope", function () {
		expect(tpl.scope).toBeDefined();
		expect(tpl.scope).not.toBeNull();
		expect(tpl.scope).toEqual(tpl.node.scope);
		expect(tpl.scope._parent).not.toBeNull();
	});

	it("child scope", function () {
		tpl.element.innerHTML = '<div data-repeat="item in items">{{item}}</div>';
		tpl.compile();
		tpl.scope.items = [1, 2];
		tpl.render();
		var childNode = tpl.getNode(tpl.element.childNodes[0]);
		var childNode2 = tpl.getNode(tpl.element.childNodes[1]);
		expect(tpl.scope.items).toEqual([1, 2]);
		expect(childNode.scope).not.toEqual(childNode2.scope);
		expect(childNode.scope).not.toEqual(tpl.scope);
		expect(childNode2.scope).not.toEqual(tpl.scope);
		expect(childNode.scope.item).toEqual(1);
		expect(childNode2.scope.item).toEqual(2);
		expect(childNode.scope._parent).toEqual(tpl.node.scope);
		expect(childNode2.scope._parent).toEqual(tpl.node.scope);
		expect(tpl.scope._children.length).toEqual(2);
		expect(tpl.scope._children[0]).toEqual(childNode.scope);
		expect(tpl.scope._children[1]).toEqual(childNode2.scope);
	});

});
