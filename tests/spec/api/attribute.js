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
		var node = tpl.node.children[0];
		expect(node.getAttribute('class').name).toEqual('class');
		expect(node.getAttribute('class').value).toEqual('{{cl}}');
		expect(node.getAttribute('{{name}}').name).toEqual('{{name}}');
		expect(node.getAttribute('{{name}}').value).toEqual('{{value}}');
		expect(node.getAttribute('c{{u}}t').name).toEqual('c{{u}}t');
		expect(node.getAttribute('c{{u}}t').value).toEqual('c{{u}}t');
		expect(node.getAttribute('{{single}}').name).toEqual('{{single}}');
		expect(node.getAttribute('{{single}}').value).toEqual('');
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
		var node = tpl.node.children[0];
		expect(node.getAttribute('class').name).toEqual('class');
		expect(node.getAttribute('class').value).toEqual('myClass');
		expect(node.getAttribute('{{name}}').name).toEqual('john');
		expect(node.getAttribute('{{name}}').value).toEqual('david');
		expect(node.getAttribute('c{{u}}t').name).toEqual('cut');
		expect(node.getAttribute('c{{u}}t').value).toEqual('cut');
		expect(node.getAttribute('{{single}}').name).toEqual('single');
		expect(node.getAttribute('{{single}}').value).toEqual('');
	});

	it("previous name", function () {
		ct.innerHTML = '<div {{class1}}="bold"></div>';
		tpl.compile();
		tpl.scope.class1 = 'class';
		tpl.render();
		if (ie === 7) {
			expect(ct.firstChild.className).toEqual('bold');
		}
		else {
			expect(ct.firstChild.getAttribute('class')).toEqual('bold');
		}
		tpl.scope.class1 = 'data-class';
		tpl.render();
		if (ie <= 8) {
			expect(ct.firstChild.className).toEqual('');
		}
		else {
			expect(ct.firstChild.getAttribute('class')).toBeNull();
		}
	});

	it("special rendering attribute value", function () {
		ct.innerHTML = '<input type="text" value="{{nickname}}">';
		tpl.compile();
		tpl.scope.nickname = 'john';
		tpl.render();
		expect(ct.firstChild.value).toEqual('john');
		ct.firstChild.value = 'fred';
		tpl.scope.nickname = 'alf';
		tpl.render();
		expect(ct.firstChild.value).toEqual('alf');
		tpl.scope.nickname = '';
		tpl.render();
		expect(ct.firstChild.value).toEqual('');
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
