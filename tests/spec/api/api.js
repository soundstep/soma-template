describe("template", function () {

	beforeEach(function () {
		createContainer();
		createTemplate();
	});

	afterEach(function () {
		disposeTemplate();
		disposeContainer();
	});

	it("check package", function () {
		expect(soma.template).not.toBeNull();
		expect(soma.template).not.toBeUndefined();
		expect(typeof soma.template === 'object').toBeTruthy();
	});

	it("check version", function () {
		expect(soma.template.version).not.toBeNull();
		expect(soma.template.version).not.toBeUndefined();
		expect(typeof soma.template.version === 'string').toBeTruthy();
	});

	it("create template with source element", function () {
		expect(tpl).not.toBeNull();
		expect(tpl).not.toBeUndefined();
		expect(tpl.toString()).toEqual('[object Template]');
		expect(tpl.element).toEqual(ct);
		expect(tpl.node).not.toBeNull();
		expect(tpl.node).not.toBeUndefined();
		expect(tpl.watchers).not.toBeNull();
		expect(tpl.watchers).not.toBeUndefined();
	});

	it("create template with source element and target element ", function () {
		var target = doc.createElement('div');
		var source = doc.createElement('div');
		source.innerHTML = "{{name}}";
		var template = soma.template.create(source, target);
		expect(template).not.toBeNull();
		expect(template).not.toBeUndefined();
		expect(template.toString()).toEqual('[object Template]');
		expect(template.element).not.toBeNull();
		expect(template.element).not.toBeUndefined();
		expect(template.element.innerHTML).not.toBeNull();
		expect(template.element.innerHTML).not.toBeUndefined();
		expect(template.element.innerHTML).toEqual(source.innerHTML);
		expect(template.node).not.toBeNull();
		expect(template.node).not.toBeUndefined();
		expect(template.watchers).not.toBeNull();
		expect(template.watchers).not.toBeUndefined();
	});

	it("create template string", function () {
		var str = "{{name}}";
		var template = soma.template.create(str, ct);
		expect(template).not.toBeNull();
		expect(template).not.toBeUndefined();
		expect(template.toString()).toEqual('[object Template]');
		expect(template.element).not.toBeNull();
		expect(template.element).not.toBeUndefined();
		expect(template.element.innerHTML).not.toBeNull();
		expect(template.element.innerHTML).not.toBeUndefined();
		expect(template.element.innerHTML).toEqual(str);
		expect(template.node).not.toBeNull();
		expect(template.node).not.toBeUndefined();
		expect(template.watchers).not.toBeNull();
		expect(template.watchers).not.toBeUndefined();
	});

	it("create template string no param throws error", function () {
		var str = "<div>{{name}}</div>";
		expect(function(){soma.template.create(str)}).toThrow(soma.template.errors.TEMPLATE_STRING_NO_ELEMENT);
	});

	it("create template no param throws error", function () {
		expect(function(){soma.template.create()}).toThrow(soma.template.errors.TEMPLATE_NO_PARAM);
	});

	it("create same template", function () {
		var same = soma.template.create(ct);
		expect(tpl.element).toBeNull();
		expect(tpl.node).toBeNull();
		expect(tpl.watchers).toBeNull();
		expect(same).not.toEqual(tpl);
		expect(same).not.toBeNull();
		expect(same).not.toBeUndefined();
		expect(same.toString()).toEqual('[object Template]');
		expect(same.element).toEqual(ct);
		expect(same.node).not.toBeNull();
		expect(same.node).not.toBeUndefined();
		expect(same.watchers).not.toBeNull();
		expect(same.watchers).not.toBeUndefined();
	});

	it("get template", function () {
		expect(soma.template.get(ct)).not.toBeNull();
		expect(soma.template.get(ct)).not.toBeUndefined();
		expect(soma.template.get(ct)).toEqual(tpl);
		expect(soma.template.get(body)).toBeUndefined();
	});

	it("render all", function () {
		var t1 = createTemplateWithContent('{{name}}');
		var t2 = createTemplateWithContent('{{name}}');
		t1.node.scope.name = "John";
		t2.node.scope.name = "David";
		soma.template.renderAll();
		expect(t1.element.innerHTML).toEqual('John');
		expect(t2.element.innerHTML).toEqual('David');
	});

	it("dispose template", function () {
		tpl.dispose();
		expect(soma.template.get(ct)).toBeUndefined();
		expect(tpl.element).toBeNull();
		expect(tpl.node).toBeNull();
		expect(tpl.watchers).toBeNull();
	});

});
