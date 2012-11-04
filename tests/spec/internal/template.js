describe("template", function () {

	var doc = document;
	var body = document.getElementsByTagName("body")[0];
	var gid = document.getElementById;
	var ct = null;
	var tpl;

	function createContainer() {
		ct = doc.createElement('div');
		ct.setAttribute('id', 'ct');
		body.appendChild(ct);
	}

	function disposeContainer() {
		body.removeChild(ct);
		ct = null;
	}

	function createTemplate() {
		tpl = soma.template.create(ct);
	}

	function disposeTemplate() {
		tpl.dispose();
		tpl = null;
	}

	beforeEach(function () {
		createContainer();
		createTemplate();
	});

	afterEach(function () {
		disposeTemplate();
		disposeContainer();
	});

	it("create template", function () {
		expect(tpl).not.toBeNull();
		expect(tpl).toBeDefined();
		expect(tpl).toEqual(jasmine.any(Template));
	});

});
