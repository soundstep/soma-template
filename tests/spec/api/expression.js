describe("api - expression", function () {

	var node, scope, attr;

	beforeEach(function () {
		createContainer();
		createTemplate();
	});

	afterEach(function () {
		disposeTemplate();
		disposeContainer();
	});

	it("value node", function () {
		ct.innerHTML = '{{name}}';
		tpl.compile();
		tpl.scope.name= 'john';
		tpl.render();
		expect(ct.innerHTML).toEqual('john');
	});

	it("value path", function () {
		ct.innerHTML = '{{d1.name}}';
		tpl.compile();
		tpl.scope.d1 = {name: 'john'};
		tpl.render();
		expect(ct.innerHTML).toEqual('john');
	});

	it("value path deep", function () {
		ct.innerHTML = '{{d1.d2.name}}';
		tpl.compile();
		tpl.scope.d1 = {d2:{name: 'john'}};
		tpl.render();
		expect(ct.innerHTML).toEqual('john');
	});

	it("function param string", function () {
		ct.innerHTML = '{{name("john", "21")}}';
		tpl.compile();
		tpl.scope.name = function(n, a) {
			expect(n).toEqual('john');
			expect(a).toEqual('21');
			return "valid";
		};
		tpl.render();
		expect(ct.innerHTML).toEqual('valid');
	});

	it("function param var", function () {
		ct.innerHTML = '{{name(n, a)}}';
		tpl.compile();
		tpl.scope.n = "john";
		tpl.scope.a = 21;
		tpl.scope.name = function(n, a) {
			expect(n).toEqual('john');
			expect(a).toEqual(21);
			return "valid";
		};
		tpl.render();
		expect(ct.innerHTML).toEqual('valid');
	});

	it("function path param string", function () {
		ct.innerHTML = '{{d1.name("john", "21")}}';
		tpl.compile();
		tpl.scope.d1 = {
			name: function(n, a) {
				tpl.scope.n = "john";
				tpl.scope.a = "21";
				return "valid";
			}
		};
		tpl.render();
		expect(ct.innerHTML).toEqual('valid');
	});

	it("function path deep param string", function () {
		ct.innerHTML = '{{d1.d2.name("john", "21")}}';
		tpl.compile();
		tpl.scope.d1 = {
			d2: {
				name: function(n, a) {
					tpl.scope.n = "john";
					tpl.scope.a = "21";
					return "valid";
				}
			}
		};
		tpl.render();
		expect(ct.innerHTML).toEqual('valid');
	});

	it("function path param var", function () {
		ct.innerHTML = '{{d1.name(n, a)}}';
		tpl.compile();
		tpl.scope.n = "john";
		tpl.scope.a = 21;
		tpl.scope.d1 = {
			name: function(n, a) {
				expect(n).toEqual('john');
				expect(a).toEqual(21);
				return "valid";
			}
		};
		tpl.render();
		expect(ct.innerHTML).toEqual('valid');
	});

	it("function path deep param var", function () {
		ct.innerHTML = '{{d1.d2.name(n, a)}}';
		tpl.compile();
		tpl.scope.n = "john";
		tpl.scope.a = 21;
		tpl.scope.d1 = {
			d2: {
				name: function(n, a) {
					expect(n).toEqual('john');
					expect(a).toEqual(21);
					return "valid";
				}
			}
		};
		tpl.render();
		expect(ct.innerHTML).toEqual('valid');
	});

	it("function params string path", function () {
		ct.innerHTML = '{{name("john.david", "21.22")}}';
		tpl.compile();
		tpl.scope.name = function(n, a) {
			expect(n).toEqual('john.david');
			expect(a).toEqual("21.22");
			return "valid";
		};
		tpl.render();
		expect(ct.innerHTML).toEqual('valid');
	});

	it("function params var path", function () {
		ct.innerHTML = '{{name(d1.n, d1.a)}}';
		tpl.compile();
		tpl.scope.d1 = {
			n: "john",
			a: 21
		};
		tpl.scope.name = function(n, a) {
			expect(n).toEqual('john');
			expect(a).toEqual(21);
			return "valid";
		};
		tpl.render();
		expect(ct.innerHTML).toEqual('valid');
	});

	it("function path params string path", function () {
		ct.innerHTML = '{{d1.d2.name("john.david", "21.22")}}';
		tpl.compile();
		tpl.scope.d1 = {
			d2: {
				name: function(n, a) {
					expect(n).toEqual('john.david');
					expect(a).toEqual("21.22");
					return "valid";
				}
			}
		}
		tpl.render();
		expect(ct.innerHTML).toEqual('valid');
	});

	it("function params var path", function () {
		ct.innerHTML = '{{d1.d2.name(d1.n, d1.a)}}';
		tpl.compile();
		tpl.scope.d1 = {
			d2: {
				name: function(n, a) {
					expect(n).toEqual('john');
					expect(a).toEqual(21);
					return "valid";
				}
			},
			n: "john",
			a: 21
		};
		tpl.render();
		expect(ct.innerHTML).toEqual('valid');
	});

	it("depth scope", function () {
		ct.innerHTML = '<div data-repeat="item in items">{{../item.name}}</div>';
		tpl.compile();
		tpl.scope.items = [
			{name: 'child1'},
			{name: 'child2'},
			{name: 'child3'}
		];
		tpl.scope.item = {name: 'parent name'};
		tpl.render();
		expect(ct.childNodes[0].innerHTML).toEqual('parent name');
		expect(ct.childNodes[1].innerHTML).toEqual('parent name');
		expect(ct.childNodes[2].innerHTML).toEqual('parent name');
	});

});
