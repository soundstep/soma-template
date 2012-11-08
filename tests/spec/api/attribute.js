describe("api - attribute", function () {

	beforeEach(function () {
		createContainer();
		createTemplate();
	});

	afterEach(function () {
		disposeTemplate();
		disposeContainer();
	});

	it("parameters", function () {
		ct.innerHTML = '<div class="{{cl}}" {{name}}="{{value}}" c{{u}}t="c{{u}}t" {{single}}></div>';
		tpl.compile();
		var divAttributes = tpl.node.children[0].attributes;
		expect(divAttributes).toBeDefined();
		expect(divAttributes).not.toBeNull();
		expect(divAttributes.length).toEqual(4);
	});

	it("name values pre-rendering", function () {
		ct.innerHTML = '<div class="{{cl}}" {{name}}="{{value}}" c{{u}}t="c{{u}}t" {{single}}></div>';
		tpl.compile();
		var divAttributes = tpl.node.children[0].attributes;
		expect(divAttributes[0].name).toEqual('class');
		expect(divAttributes[0].value).toEqual('{{cl}}');
		expect(divAttributes[1].name).toEqual('{{name}}');
		expect(divAttributes[1].value).toEqual('{{value}}');
		expect(divAttributes[2].name).toEqual('c{{u}}t');
		expect(divAttributes[2].value).toEqual('c{{u}}t');
		expect(divAttributes[3].name).toEqual('{{single}}');
		expect(divAttributes[3].value).toEqual('');
	});

	it("name values post-rendering", function () {
		ct.innerHTML = '<div class="{{cl}}" {{name}}="{{value}}" c{{u}}t="c{{u}}t" {{single}}></div>';
		tpl.compile();
		tpl.scope.cl = 'myClass';
		tpl.scope.name = 'john';
		tpl.scope.value = 'david';
		tpl.scope.u = 'u';
		tpl.scope.single = 'single';
		var divAttributes = tpl.node.children[0].attributes;
		divAttributes[0].update();
		divAttributes[0].render();
		divAttributes[1].update();
		divAttributes[1].render();
		divAttributes[2].update();
		divAttributes[2].render();
		divAttributes[3].update();
		divAttributes[3].render();
		expect(ct.innerHTML).toEqual('<div class="myClass" john="david" cut="cut" single=""></div>');
		expect(divAttributes[0].name).toEqual('class');
		expect(divAttributes[0].value).toEqual('myClass');
		expect(divAttributes[1].name).toEqual('john');
		expect(divAttributes[1].value).toEqual('david');
		expect(divAttributes[2].name).toEqual('cut');
		expect(divAttributes[2].value).toEqual('cut');
		expect(divAttributes[3].name).toEqual('single');
		expect(divAttributes[3].value).toEqual('');
	});

	it("name values post-rendering", function () {
		ct.innerHTML = '<div class="{{cl}}" {{name}}="{{value}}" c{{u}}t="c{{u}}t" {{single}}></div>';
		tpl.compile();
		tpl.scope.cl = 'myClass';
		tpl.scope.name = 'john';
		tpl.scope.value = 'david';
		tpl.scope.u = 'u';
		tpl.scope.single = 'single';
		var divAttributes = tpl.node.children[0].attributes;
		divAttributes[0].update();
		divAttributes[0].render();
		divAttributes[1].update();
		divAttributes[1].render();
		divAttributes[2].update();
		divAttributes[2].render();
		divAttributes[3].update();
		divAttributes[3].render();
		expect(ct.innerHTML).toEqual('<div class="myClass" john="david" cut="cut" single=""></div>');
		expect(divAttributes[0].name).toEqual('class');
		expect(divAttributes[0].value).toEqual('myClass');
		expect(divAttributes[1].name).toEqual('john');
		expect(divAttributes[1].value).toEqual('david');
		expect(divAttributes[2].name).toEqual('cut');
		expect(divAttributes[2].value).toEqual('cut');
		expect(divAttributes[3].name).toEqual('single');
	});

	it("dispose", function () {
		ct.innerHTML = '<div {{name}}="{{value}}"></div>';
		tpl.compile();
		var divAttributes = tpl.node.children[0].attributes;
		divAttributes[0].update();
		divAttributes[0].render();
		divAttributes[0].dispose();
		expect(divAttributes[0].interpolationName).toBeNull();
		expect(divAttributes[0].interpolationValue).toBeNull();
		expect(divAttributes[0].name).toBeNull();
		expect(divAttributes[0].value).toBeNull();
		expect(divAttributes[0].node).toBeNull();
	});

});
