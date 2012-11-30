describe("api - bootstrap", function () {

	beforeEach(function () {
		createContainer();
		createTemplate();
	});

	afterEach(function () {
		disposeTemplate();
		disposeContainer();
	});

	it("template created", function () {
		var content = document.getElementById('tpl-bootstrap');
		var template = soma.template.get(content);
		expect(template).toBeDefined();
		expect(content.innerHTML).toEqual('john');
		template.dispose();
		template = null;
	});

	it("template package created", function () {
		var content = document.getElementById('tpl-bootstrap-package');
		var template = soma.template.get(content);
		expect(template).toBeDefined();
		expect(content.innerHTML).toEqual('david');
		template.dispose();
		template = null;
	});

	it("template package error", function () {
		var content = document.getElementById('tpl-bootstrap-error');
		var template = soma.template.get(content);
		expect(template).toBeUndefined();
	});

});
