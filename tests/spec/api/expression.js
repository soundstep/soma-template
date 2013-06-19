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

	it("array", function () {
		ct.innerHTML = '{{path[0][0]}}{{path[0][1]}}{{path[1][0]}}{{path[1][1]}}';
		tpl.compile();
		tpl.scope.path = [
			[1, 2],
			[3, 4]
		];
		tpl.render();
		expect(ct.innerHTML).toEqual('1234');
	});

	it("array path", function () {
		ct.innerHTML = '{{path[0].path[0]}}{{path[0].path[1]}}{{path[1].path[0]}}{{path[1].path[1]}}';
		tpl.compile();
		tpl.scope.path = [
			{path: [1, 2]},
			{path: [3, 4]}
		];
		tpl.render();
		expect(ct.innerHTML).toEqual('1234');
	});

	it("array path end", function () {
		ct.innerHTML = '{{path[0].path[0].num}}{{path[0].path[1].num}}{{path[1].path[0].num}}{{path[1].path[1].num}}';
		tpl.compile();
		tpl.scope.path = [
			{path: [{num:1}, {num:2}]},
			{path: [{num:3}, {num:4}]}
		];
		tpl.render();
		expect(ct.innerHTML).toEqual('1234');
	});

	it("array function", function () {
		ct.innerHTML = '{{path[0]()}}{{path[1]()}}';
		tpl.compile();
		tpl.scope.path = [
			function(){return 1;},
			function(){return 2;}
		];
		tpl.render();
		expect(ct.innerHTML).toEqual('12');
	});

	it("array function param string", function () {
		ct.innerHTML = '{{path[0]("1")}}{{path[1]("2")}}';
		tpl.compile();
		tpl.scope.path = [
			function(p){return p;},
			function(p){return p;}
		];
		tpl.render();
		expect(ct.innerHTML).toEqual('12');
	});

	it("array function param array", function () {
		ct.innerHTML = '{{path[0](p[0])}}{{path[1](p[1])}}';
		tpl.compile();
		tpl.scope.path = [
			function(p){return p;},
			function(p){return p;}
		];
		tpl.scope.p = [1, 2];
		tpl.render();
		expect(ct.innerHTML).toEqual('12');
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

	it("function param function", function () {
		//ct.innerHTML = '{{name(\'21\')}}';
		ct.innerHTML = '{{name(age())}}';
		tpl.compile();
		tpl.scope.age = function() {
			return 21;
		};
		tpl.scope.name = function(age) {
			return "john" + " " + age;
		};
		tpl.render();
		console.log(ct.innerHTML);
		expect(ct.innerHTML).toEqual('john 21');
	});

	it("function param double function", function () {
		ct.innerHTML = '{{name(age(), str())}}';
		tpl.compile();
		tpl.scope.age = function() {
			return 21;
		};
		tpl.scope.str = function() {
			return 'year old';
		};
		tpl.scope.name = function(age, str) {
			return "john" + " " + age + " " + "years old";
		};
		tpl.render();
		console.log(ct.innerHTML);
		expect(ct.innerHTML).toEqual('john 21 years old');
	});

	it("function param function with params", function () {
		ct.innerHTML = '{{name(age("21"))}}';
		tpl.compile();
		tpl.scope.age = function(age) {
			return parseInt(age) + 2;
		};
		tpl.scope.name = function(age) {
			return "john" + " " + age;
		};
		tpl.render();
		console.log(ct.innerHTML);
		expect(ct.innerHTML).toEqual('john 23');
	});

	it("function param function with double params", function () {
		//ct.innerHTML = '{{name(age("21", "2"), "years old")}}';
		ct.innerHTML = '{{name(age("21", "2"), "years old")}}';
		tpl.compile();
		tpl.scope.age = function(age, add) {
			console.log(age, add);
			return parseInt(age) + parseInt(add);
		};
		tpl.scope.age2 = function(age) {
			console.log(age);
			return parseInt(age);
		};
		tpl.scope.name = function(age, str) {
			console.log(age, str);
			return "john" + " " + age + " " + str;
		};
		tpl.render();
		console.log(ct.innerHTML);
		expect(ct.innerHTML).toEqual('john 23 years old');
	});

});
