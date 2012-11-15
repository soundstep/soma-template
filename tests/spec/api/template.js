describe("api - template", function () {

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
		expect(soma.template).toBeDefined();
		expect(soma.template).toEqual(jasmine.any(Object));
	});

	it("check version", function () {
		expect(soma.template.version).not.toBeNull();
		expect(soma.template.version).toBeDefined();
		expect(typeof soma.template.version === 'string').toBeTruthy();
	});

	it("create template with source element", function () {
		expect(tpl).not.toBeNull();
		expect(tpl).toBeDefined();
		expect(tpl.toString()).toEqual('[object Template]');
		expect(tpl.element).toEqual(ct);
		expect(tpl.node).not.toBeNull();
		expect(tpl.scope).not.toBeNull();
		expect(tpl.watchers).not.toBeNull();
		expect(tpl.watchers).toBeDefined();
	});

	it("create template with source element and target element", function () {
		var target = doc.createElement('div');
		var source = doc.createElement('script');
		source.setAttribute('type', 'text/x-soma-template');
		source.innerHTML = "{{name}}";
		var template = soma.template.create(source, target);
		expect(template).not.toBeNull();
		expect(template).toBeDefined();
		expect(template.toString()).toEqual('[object Template]');
		expect(template.element).not.toBeNull();
		expect(template.element).toBeDefined();
		expect(template.element.innerHTML).not.toBeNull();
		expect(template.element.innerHTML).toBeDefined();
		expect(template.element.innerHTML).toEqual(source.innerHTML);
		expect(template.node).not.toBeNull();
		expect(template.scope).not.toBeNull();
		expect(template.watchers).not.toBeNull();
		expect(template.watchers).toBeDefined();
		template.scope.name = 'john';
		template.render();
		expect(target.innerHTML).toEqual('john');
	});

	it("create template string", function () {
		var str = "{{name}}";
		var template = soma.template.create(str, ct);
		expect(template).not.toBeNull();
		expect(template).toBeDefined();
		expect(template.toString()).toEqual('[object Template]');
		expect(template.element).not.toBeNull();
		expect(template.element).toBeDefined();
		expect(template.element.innerHTML).not.toBeNull();
		expect(template.element.innerHTML).toBeDefined();
		expect(template.element.innerHTML).toEqual(str);
		expect(template.node).not.toBeNull();
		expect(template.scope).not.toBeNull();
		expect(template.watchers).not.toBeNull();
		expect(template.watchers).toBeDefined();
		template.scope.name = 'john';
		template.render();
		expect(ct.innerHTML).toEqual('john');
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
		expect(same).toBeDefined();
		expect(same.toString()).toEqual('[object Template]');
		expect(same.element).toEqual(ct);
		expect(same.node).not.toBeNull();
		expect(same.node).toBeDefined();
		expect(same.watchers).not.toBeNull();
		expect(same.watchers).toBeDefined();
	});

	it("get template", function () {
		expect(soma.template.get(ct)).not.toBeNull();
		expect(soma.template.get(ct)).toBeDefined();
		expect(soma.template.get(ct)).toEqual(tpl);
		expect(soma.template.get(body)).toBeUndefined();
	});

	it("dispose template", function () {
		tpl.dispose();
		expect(soma.template.get(ct)).toBeUndefined();
		expect(tpl.element).toBeNull();
		expect(tpl.node).toBeNull();
		expect(tpl.watchers).toBeNull();
	});

	it("compile element", function () {
		var node = tpl.node;
		ct.innerHTML = '{{name}}';
		tpl.compile(ct);
		expect(tpl.element).toEqual(ct);
		expect(tpl.node).not.toEqual(node);
		expect(tpl.node.children[0].interpolation).not.toBeNull();
		expect(tpl.node.children[0].interpolation.expressions.length).toEqual(1);
	});

	it("update template with data", function () {
		ct.innerHTML = '{{name}}';
		tpl.compile(ct);
		tpl.update({name:"john"});
		expect(ct.innerHTML).toEqual('{{name}}');
		expect(tpl.node.children[0].interpolation).not.toBeNull();
		expect(tpl.node.children[0].interpolation.expressions.length).toEqual(1);
		expect(tpl.node.children[0].interpolation.expressions[0].pattern).toEqual('name');
		expect(tpl.node.children[0].interpolation.expressions[0].value).toEqual('john');
	});

	it("update template with data using scope", function () {
		ct.innerHTML = '{{name}}';
		tpl.compile(ct);
		tpl.scope.name = 'john';
		tpl.update();
		expect(ct.innerHTML).toEqual('{{name}}');
		expect(tpl.node.children[0].interpolation).not.toBeNull();
		expect(tpl.node.children[0].interpolation.expressions.length).toEqual(1);
		expect(tpl.node.children[0].interpolation.expressions[0].pattern).toEqual('name');
		expect(tpl.node.children[0].interpolation.expressions[0].value).toEqual('john');
	});

	it("render template with data", function () {
		ct.innerHTML = '{{name}}';
		tpl.compile(ct);
		tpl.render({name:"john"});
		expect(tpl.node.children[0].interpolation).not.toBeNull();
		expect(tpl.node.children[0].interpolation.expressions.length).toEqual(1);
		expect(tpl.node.children[0].interpolation.expressions[0].pattern).toEqual('name');
		expect(tpl.node.children[0].interpolation.expressions[0].value).toEqual('john');
		expect(ct.innerHTML).toEqual('john');
	});

	it("template in template render parent", function () {
		var t1 = createTemplateWithContent('{{name}}');
		var t2 = createTemplateWithContent('{{name}}');
		t1.scope.name = "john";
		t2.scope.name = "david2";
		t1.render();
		expect(t1.element.innerHTML).toEqual('john');
		expect(t2.element.innerHTML).toEqual('{{name}}');
	});

	it("template in template render child", function () {
		var t1 = createTemplateWithContent('{{name}}');
		var t2 = createTemplateWithContent('{{name}}');
		t1.scope.name = "john";
		t2.scope.name = "david";
		t2.render();
		expect(t1.element.innerHTML).toEqual('{{name}}');
		expect(t2.element.innerHTML).toEqual('david');
	});

	it("template in template render both", function () {
		var t1 = createTemplateWithContent('{{name}}');
		var t2 = createTemplateWithContent('{{name}}');
		t1.scope.name = "john";
		t2.scope.name = "david";
		t1.render();
		t2.render();
		expect(t1.element.innerHTML).toEqual('john');
		expect(t2.element.innerHTML).toEqual('david');
	});

	it("extend default", function () {
		expect(soma.template.helpers()).toEqual({});
	});

	it("extend value", function () {
		ct.innerHTML = '{{name}}';
		soma.template.helpers({name: 'david'});
		tpl.compile();
		tpl.render();
		expect(ct.innerHTML).toEqual('david');
		tpl.scope.name = 'john';
		tpl.render();
		expect(ct.innerHTML).toEqual('john');
		soma.template.helpers(null);
	});

	it("extend function", function () {
		ct.innerHTML = '{{getName("john")}}';
		soma.template.helpers({
			getName: function(n) {
				return "getName: " + n;
			}
		});
		tpl.compile();
		tpl.render();
		expect(ct.innerHTML).toEqual('getName: john');
		tpl.scope.getName = function(n){
			return "getName in scope: " + n;
		}
		tpl.render();
		expect(ct.innerHTML).toEqual('getName in scope: john');
		soma.template.helpers(null);
	});

	it("extend append", function () {
		soma.template.helpers({value1: 'value1'});
		soma.template.helpers({value2: 'value2'});
		expect(soma.template.helpers()).toEqual({value1: 'value1', value2: 'value2'});
		soma.template.helpers(null);
	});

	it("extend null", function () {
		soma.template.helpers({value1: 'value1'});
		soma.template.helpers(null);
		expect(soma.template.helpers()).toEqual({});
	});

	it("extend with library", function () {
		soma.template.helpers(_.str.exports());
		ct.innerHTML = '{{camelize(str)}}';
		tpl.compile();
		tpl.scope.str = "-this-is-a-camelized-string";
		tpl.render();
		expect(ct.innerHTML).toEqual('ThisIsACamelizedString');
	});

	it("extend no value", function () {
		// do nothing
	});

	it("render all", function () {
		var t1 = createTemplateWithContent('{{name}}');
		var t2 = createTemplateWithContent('{{name}}');
		t1.scope.name = "john";
		t2.scope.name = "david";
		soma.template.renderAll();
		expect(t1.element.innerHTML).toEqual('john');
		expect(t2.element.innerHTML).toEqual('david');
	});

});
