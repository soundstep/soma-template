describe("api - node", function () {

	beforeEach(function () {
		createContainer();
		createTemplate();
	});

	afterEach(function () {
		disposeTemplate();
		disposeContainer();
	});

	it("root node", function () {
		expect(tpl.node).toBeDefined();
		expect(tpl.node).not.toBeNull();
		expect(tpl.node.parent).toBeNull();
		expect(tpl.node.children.length).toEqual(0);
		expect(tpl.node.element).toEqual(ct);
		expect(tpl.node.scope).toEqual(tpl.scope);
	});

	it("children", function () {
		var text = doc.createTextNode('{{name}}');
		var text2 = doc.createTextNode('{{age}}');
		var p = doc.createElement('p');
		var p2 = doc.createElement('p');
		p.appendChild(text);
		p2.appendChild(text2);
		ct.appendChild(p);
		ct.appendChild(p2);
		tpl.compile();
		expect(tpl.node.element).toEqual(ct);
		expect(tpl.node.children[0].element).toEqual(p);
		expect(tpl.node.children[1].element).toEqual(p2);
		expect(tpl.node.children[0].children[0].element).toEqual(text);
		expect(tpl.node.children[1].children[0].element).toEqual(text2);
	});

	it("children repeater", function () {
		ct.innerHTML = '<div data-repeat="item in items">{{item}}</div>';
		tpl.compile();
		tpl.scope.items = [1, 2];
		tpl.render();
		expect(tpl.node.element).toEqual(ct);
		expect(tpl.node.children[0].element.outerHTML).toEqual('<div data-repeat="item in items">{{item}}</div>');
		expect(tpl.node.children[0].childrenRepeater[0].element).toEqual(ct.childNodes[0]);
		expect(tpl.node.children[0].childrenRepeater[1].element).toEqual(ct.childNodes[1]);
	});

	it("element", function () {
		ct.innerHTML = '<div>{{name}}</div>';
		tpl.compile();
		expect(tpl.node.element).toEqual(ct);
		expect(tpl.node.children[0].element).toEqual(ct.firstChild);
		expect(tpl.node.children[0].children[0].element).toEqual(ct.firstChild.firstChild);
	});

	it("scope", function () {
		ct.innerHTML = '<div>{{name}}</div>';
		tpl.compile();
		expect(tpl.node.scope).toBeDefined();
		expect(tpl.node.scope).toEqual(tpl.scope);
		expect(tpl.node.children[0].scope).toEqual(tpl.scope);
		expect(tpl.node.children[0].children[0].scope).toEqual(tpl.scope);
	});

	it("attributes", function () {
		ct.innerHTML = '<div class="{{cl}}" {{name}}="{{value}}" c{{u}}t="c{{u}}t" {{single}}></div>';
		tpl.compile();
		expect(tpl.node.children[0].attributes.length).toEqual(4);
	});

	it("interpolation", function () {
		ct.innerHTML = '{{name}}';
		tpl.compile();
		expect(tpl.node.interpolation).toBeNull();
		expect(tpl.node.children[0].interpolation).toBeDefined();
		expect(tpl.node.children[0].interpolation).not.toBeNull();
	});

	it("invalidate", function () {
		ct.innerHTML = '<div data-repeat="item in items">{{item}}</div><div>{{name}}</div>';
		tpl.compile();
		tpl.scope.items = [1, 2, 3];
		tpl.render();
		expect(tpl.node.invalidate).toBeFalsy();
		tpl.invalidate();
		expect(tpl.node.invalidate).toBeTruthy();
		expect(tpl.node.children[0]).toBeTruthy();
		expect(tpl.node.children[1]).toBeTruthy();
		expect(tpl.node.children[0].childrenRepeater[0]).toBeTruthy();
		expect(tpl.node.children[0].childrenRepeater[1]).toBeTruthy();
		expect(tpl.node.children[0].childrenRepeater[2]).toBeTruthy();
	});

	it("skip", function () {
		ct.innerHTML = '<div data-skip></div>';
		tpl.compile();
		expect(tpl.node.skip).toBeFalsy();
		expect(tpl.node.children.length).toEqual(0);
	});

	it("repeater", function () {
		ct.innerHTML = '<div data-repeat="item in items">{{item}}</div>';
		tpl.compile();
		expect(tpl.node.children[0].repeater).toEqual('item in items');
	});

	it("parent", function () {
		ct.innerHTML = '<div></div>';
		tpl.compile();
		expect(tpl.node.parent).toBeNull();
		expect(tpl.node.children[0].parent).toBeDefined();
		expect(tpl.node.children[0].parent).not.toBeNull();
		expect(tpl.node.children[0].parent).toEqual(tpl.node);
	});

	it("template", function () {
		ct.innerHTML = '<div data-repeat="item in items">{{item}}</div>';
		tpl.compile();
		tpl.scope.items = [1, 2, 3];
		tpl.render();
		expect(tpl.node.template).toEqual(tpl);
		expect(tpl.node.children[0].template).toEqual(tpl);
		expect(tpl.node.children[0].childrenRepeater[0].template).toEqual(tpl);
		expect(tpl.node.children[0].childrenRepeater[1].template).toEqual(tpl);
		expect(tpl.node.children[0].childrenRepeater[2].template).toEqual(tpl);
	});

	it("previous sibling", function () {
		ct.innerHTML = '<p></p><p></p>';
		tpl.compile();
		expect(tpl.node.children[1].previousSibling).toEqual(tpl.node.children[0].element);
	});

	it("next sibling", function () {
		ct.innerHTML = '<p></p><p></p>';
		tpl.compile();
		expect(tpl.node.children[0].nextSibling).toEqual(tpl.node.children[1].element);
	});



});
