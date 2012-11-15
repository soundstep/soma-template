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

	it("get node from element", function () {
		var p1 = doc.createElement('p');
		var p1b = doc.createElement('p');
		var p2 = doc.createElement('p');
		p1.appendChild(p2);
		ct.appendChild(p1);
		ct.appendChild(p1b);
		tpl.compile(ct);
		expect(tpl.getNode(p1)).toEqual(tpl.node.children[0]);
		expect(tpl.getNode(p1b)).toEqual(tpl.node.children[1]);
		expect(tpl.getNode(p2)).toEqual(tpl.node.children[0].children[0]);
	});

	it("get node child repeater from element", function () {
		tpl.element.innerHTML = '<div data-repeat="item in items">{{$index}}</div>';
		tpl.compile();
		tpl.scope.items = [1, 2, 3];
		tpl.render();
		expect(tpl.getNode(tpl.element.childNodes[0])).toEqual(tpl.node.children[0].childrenRepeater[0])
		expect(tpl.getNode(tpl.element.childNodes[1])).toEqual(tpl.node.children[0].childrenRepeater[1])
		expect(tpl.getNode(tpl.element.childNodes[2])).toEqual(tpl.node.children[0].childrenRepeater[2])
	});

	it("values pre-rendering", function () {
		ct.innerHTML = '<p>{{name}}</p>';
		tpl.compile();
		tpl.scope.name = 'john';
		tpl.node.children[0].children[0].update();
		expect(ct.innerHTML).toEqual('<p>{{name}}</p>');
		expect(tpl.node.children[0].children[0].value).toEqual('{{name}}');
	});

	it("values post-rendering", function () {
		ct.innerHTML = '<p>{{name}}</p>';
		tpl.compile();
		tpl.scope.name = 'john';
		tpl.node.children[0].children[0].update();
		tpl.node.children[0].children[0].render();
		expect(ct.innerHTML).toEqual('<p>john</p>');
		expect(tpl.node.children[0].children[0].value).toEqual('john');
	});

	it("getAttributeByName", function () {
		ct.innerHTML = '<p data-id="{{idvalue}}" c{{classname}}s="{{boldvalue}}">{{name}}</p>';
		tpl.compile();
		tpl.scope.classname = 'las';
		tpl.scope.boldvalue = 'bold';
		tpl.scope.idvalue = 'id';
		var attribute = tpl.node.children[0].getAttribute('c{{classname}}s');
		tpl.render();
		var att1 = tpl.node.children[0].getAttribute('c{{classname}}s');
		var att2 = tpl.node.children[0].getAttribute('data-id');
		expect(att1).toBeDefined();
		expect(att1.value).toEqual('bold');
		expect(att1.interpolationName.value).toEqual('c{{classname}}s');
		expect(att2).toBeDefined();
		expect(att2.value).toEqual('id');
		expect(att2.interpolationValue.value).toEqual('{{idvalue}}');
	});

	it("dispose", function() {
		tpl.element.innerHTML = '{{name}}<div data-repeat="item in items">{{$index}}</div><div><p>{{age}}</p></div>';
		tpl.compile();
		tpl.scope.items = [1, 2, 3];
		tpl.scope.name = 'john';
		tpl.scope.age = 21;
		tpl.render();
		tpl.node.dispose();
		expect(tpl.node.element).toBeNull();
		expect(tpl.node.scope).toBeNull();
		expect(tpl.node.attributes).toBeNull();
		expect(tpl.node.value).toBeNull();
		expect(tpl.node.interpolation).toBeNull();
		expect(tpl.node.repeater).toBeNull();
		expect(tpl.node.parent).toBeNull();
		expect(tpl.node.children).toBeNull();
		expect(tpl.node.childrenRepeater).toBeNull();
		expect(tpl.node.previousSibling).toBeNull();
		expect(tpl.node.nextSibling).toBeNull();
		expect(tpl.node.template).toBeNull();
	});

});
