describe("api - interpolation", function () {

	beforeEach(function () {
		createContainer();
		createTemplate();
	});

	afterEach(function () {
		disposeTemplate();
		disposeContainer();
	});

	it("node single", function () {
		ct.innerHTML = '{{name}}';
		tpl.compile();
		tpl.scope.name = 'john';
		tpl.render();
		expect(ct.innerHTML).toEqual('john');
	});

	it("node double", function () {
		ct.innerHTML = '{{name}}{{age}}';
		tpl.compile();
		tpl.scope.name = 'john';
		tpl.scope.age = 21;
		tpl.render();
		expect(ct.innerHTML).toEqual('john21');
	});

	it("node prefix", function () {
		ct.innerHTML = 'my name is {{name}}';
		tpl.compile();
		tpl.scope.name = 'john';
		tpl.render();
		expect(ct.innerHTML).toEqual('my name is john');
	});

	it("node suffix", function () {
		ct.innerHTML = '{{name}} is my name';
		tpl.compile();
		tpl.scope.name = 'john';
		tpl.render();
		expect(ct.innerHTML).toEqual('john is my name');
	});

	it("node multiple prefix", function () {
		ct.innerHTML = 'my name is {{name}} and my age is {{age}}';
		tpl.compile();
		tpl.scope.name = 'john';
		tpl.scope.age = 21;
		tpl.render();
		expect(ct.innerHTML).toEqual('my name is john and my age is 21');
	});

	it("node multiple suffix", function () {
		ct.innerHTML = '{{name}} is my name and {{age}} is my age';
		tpl.compile();
		tpl.scope.name = 'john';
		tpl.scope.age = 21;
		tpl.render();
		expect(ct.innerHTML).toEqual('john is my name and 21 is my age');
	});

	it("attribute name single", function () {
		ct.innerHTML = '<p {{single}}></p>';
		tpl.compile();
		tpl.scope.single = 'single';
		tpl.render();
		expect(ct.firstChild.getAttribute('single')).toEqual('');
	});

	it("attribute value single", function () {
		ct.innerHTML = '<p data-id="{{cl}}"></p>';
		tpl.compile();
		tpl.scope.cl = 'myClass';
		tpl.render();
		expect(ct.firstChild.getAttribute('data-id')).toEqual('myClass');
	});

	it("attribute name value single", function () {
		ct.innerHTML = '<p {{cl1}}="{{cl2}}"></p>';
		tpl.compile();
		tpl.scope.cl1 = 'data-id';
		tpl.scope.cl2 = 'myClass';
		tpl.render();
		expect(ct.firstChild.getAttribute('data-id')).toEqual('myClass');
	});

	it("attribute name prefix", function () {
		ct.innerHTML = '<p s{{ingle}}></p>';
		tpl.compile();
		tpl.scope.ingle = 'ingle';
		tpl.render();
		expect(ct.firstChild.getAttribute('single')).toEqual('');
	});

	it("attribute name suffix", function () {
		ct.innerHTML = '<p {{singl}}e></p>';
		tpl.compile();
		tpl.scope.singl = 'singl';
		tpl.render();
		expect(ct.firstChild.getAttribute('single')).toEqual('');
	});

	it("attribute value prefix", function () {
		ct.innerHTML = '<p data-id="my{{cl}}"></p>';
		tpl.compile();
		tpl.scope.cl = 'Class';
		tpl.render();
		expect(ct.firstChild.getAttribute('data-id')).toEqual('myClass');
	});

	it("attribute value suffix", function () {
		ct.innerHTML = '<p data-id="{{my}}Class"></p>';
		tpl.compile();
		tpl.scope.my = 'my';
		tpl.render();
		expect(ct.firstChild.getAttribute('data-id')).toEqual('myClass');
	});

	it("attribute name multiple prefix", function () {
		ct.innerHTML = '<p s{{i}}g{{le}}></p>';
		tpl.compile();
		tpl.scope.i = 'in';
		tpl.scope.le = 'le';
		tpl.render();
		expect(ct.firstChild.getAttribute('single')).toEqual('');
	});

	it("attribute name multiple suffix", function () {
		ct.innerHTML = '<p {{s}}in{{gl}}e></p>';
		tpl.compile();
		tpl.scope.s = 's';
		tpl.scope.gl = 'gl';
		tpl.render();
		expect(ct.firstChild.getAttribute('single')).toEqual('');
	});

	it("attribute value multiple prefix", function () {
		ct.innerHTML = '<p data-id="m{{y}}Cl{{ass}}"></p>';
		tpl.compile();
		tpl.scope.y = 'y';
		tpl.scope.ass = 'ass';
		tpl.render();
		expect(ct.firstChild.getAttribute('data-id')).toEqual('myClass');
	});

	it("attribute value multiple suffix", function () {
		ct.innerHTML = '<p data-id="{{my}}C{{la}}ss"></p>';
		tpl.compile();
		tpl.scope.my = 'my';
		tpl.scope.la = 'la';
		tpl.render();
		expect(ct.firstChild.getAttribute('data-id')).toEqual('myClass');
	});

	it("attribute name value single", function () {
		ct.innerHTML = '<p {{class1}}="{{myClass}}"></p>';
		tpl.compile();
		tpl.scope.class1 = 'data-id';
		tpl.scope.myClass = 'myClass';
		tpl.render();
		expect(ct.firstChild.getAttribute('data-id')).toEqual('myClass');
	});

	it("attribute name value prefix", function () {
		ct.innerHTML = '<p {{data}}-id="m{{yClass}}"></p>';
		tpl.compile();
		tpl.scope.data = 'data';
		tpl.scope.yClass = 'yClass';
		tpl.render();
		expect(ct.firstChild.getAttribute('data-id')).toEqual('myClass');
	});

	it("attribute name value suffix", function () {
		ct.innerHTML = '<p data-{{id}}="{{myClas}}s"></p>';
		tpl.compile();
		tpl.scope.id = 'id';
		tpl.scope.myClas = 'myClas';
		tpl.render();
		expect(ct.firstChild.getAttribute('data-id')).toEqual('myClass');
	});

	it("attribute name value multiple prefix", function () {
		ct.innerHTML = '<p da{{ta}}-{{id}}="m{{y}}Cla{{ss}}"></p>';
		tpl.compile();
		tpl.scope.ta = 'ta';
		tpl.scope.id = 'id';
		tpl.scope.y = 'y';
		tpl.scope.ss = 'ss';
		tpl.render();
		expect(ct.firstChild.getAttribute('data-id')).toEqual('myClass');
	});

	it("attribute name value multiple suffix", function () {
		ct.innerHTML = '<p {{da}}ta{{dash}}id="{{my}}Cla{{s}}s"></p>';
		tpl.compile();
		tpl.scope.da = 'da';
		tpl.scope.dash = '-';
		tpl.scope.s = 's';
		tpl.scope.my = 'my';
		tpl.render();
		expect(ct.firstChild.getAttribute('data-id')).toEqual('myClass');
	});

});
