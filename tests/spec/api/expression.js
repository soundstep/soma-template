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

	it("function param number", function () {
		ct.innerHTML = '{{age(12)}}';
		tpl.compile();
		tpl.scope.age = function(a) {
			expect(a).toEqual(12);
			return a;
		};
		tpl.render();
		expect(ct.innerHTML).toEqual('12');
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

	it("expression not evaluated with undefined on repeater", function () {
		var count = 0;
		ct.innerHTML = '<div data-repeat="item in items" class="{{func(item.name)}}"></div>';
		tpl.compile();
		tpl.scope.items = [
			{name: 'child1'},
			{name: 'child2'},
			{name: 'child3'}
		];
		tpl.scope.func = function(name) {
			count++;
			return name;
		};
		tpl.render();
		expect(count).toEqual(3);
	});

	it("function param $element", function () {
		var storeClass = [];
		var storeElement = [];
		ct.innerHTML = '<div class="{{testClass($element)}}">{{testElement($element)}}</div><div class="{{testClass($element)}}">{{testElement($element)}}</div>';
		tpl.compile();
		tpl.scope.testClass = function(element) {
			storeClass.push(element);
			return '';
		};
		tpl.scope.testElement = function(element) {
			storeElement.push(element);
			return '';
		};
		tpl.render();
		expect(storeClass[0]).toEqual(ct.childNodes[0]);
		expect(storeClass[1]).toEqual(ct.childNodes[1]);
		expect(storeElement[0]).toEqual(ct.childNodes[0].firstChild);
		expect(storeElement[1]).toEqual(ct.childNodes[1].firstChild);
	});

	it("function param $element in repeater", function () {
		var storeClass = [];
		var storeElement = [];
		ct.innerHTML = '<div data-repeat="item in items" class="{{testClass($element)}}">{{testElement($element)}}</div>';
		tpl.compile();
		tpl.scope.items = [
			{name: 'child1'},
			{name: 'child2'},
			{name: 'child3'}
		];
		tpl.scope.testClass = function(element) {
			storeClass.push(element);
			return '';
		};
		tpl.scope.testElement = function(element) {
			storeElement.push(element);
			return '';
		};
		tpl.render();
		expect(storeClass[0]).toEqual(ct.childNodes[0]);
		expect(storeClass[1]).toEqual(ct.childNodes[1]);
		expect(storeClass[2]).toEqual(ct.childNodes[2]);
		expect(storeElement[0]).toEqual(ct.childNodes[0].firstChild);
		expect(storeElement[1]).toEqual(ct.childNodes[1].firstChild);
		expect(storeElement[2]).toEqual(ct.childNodes[2].firstChild);
	});

	it("function param $parentElement", function () {
		var storeClass = [];
		var storeElement = [];
		ct.innerHTML = '<div class="{{testClass($parentElement)}}">{{testElement($parentElement)}}</div><div class="{{testClass($parentElement)}}">{{testElement($parentElement)}}</div>';
		tpl.compile();
		tpl.scope.testClass = function(parentElement) {
			storeClass.push(parentElement);
			return '';
		};
		tpl.scope.testElement = function(parentElement) {
			storeElement.push(parentElement);
			return '';
		};
		tpl.render();
		expect(storeClass[0]).toEqual(ct);
		expect(storeClass[1]).toEqual(ct);
		expect(storeElement[0]).toEqual(ct.childNodes[0]);
		expect(storeElement[1]).toEqual(ct.childNodes[1]);
	});

	it("function param $parentElement in repeater", function () {
		var storeClass = [];
		var storeElement = [];
		ct.innerHTML = '<div data-repeat="item in items" class="{{testClass($parentElement)}}">{{testElement($parentElement)}}</div>';
		tpl.compile();
		tpl.scope.items = [
			{name: 'child1'},
			{name: 'child2'},
			{name: 'child3'}
		];
		tpl.scope.testClass = function(parentElement) {
			storeClass.push(parentElement);
			return '';
		};
		tpl.scope.testElement = function(parentElement) {
			storeElement.push(parentElement);
			return '';
		};
		tpl.render();
		expect(storeClass[0]).toEqual(ct);
		expect(storeClass[1]).toEqual(ct);
		expect(storeClass[2]).toEqual(ct);
		expect(storeElement[0]).toEqual(ct.childNodes[0]);
		expect(storeElement[1]).toEqual(ct.childNodes[1]);
		expect(storeElement[2]).toEqual(ct.childNodes[2]);
	});

	it("function param $attribute", function () {
		var storeClass = [];
		var storeElement = [];
		ct.innerHTML = '<div class="{{testClass($attribute)}}">{{testElement($attribute)}}</div><div class="{{testClass($attribute)}}">{{testElement($attribute)}}</div>';
		tpl.compile();
		tpl.scope.testClass = function(attr) {
			storeClass.push(attr);
			return '';
		};
		tpl.scope.testElement = function(attr) {
			storeElement.push(attr);
			return '';
		};
		tpl.render();
		expect(storeClass[0].name).toEqual('class');
		expect(storeClass[0].node.element).toEqual(ct.childNodes[0]);
		expect(storeClass[1].name).toEqual('class');
		expect(storeClass[1].node.element).toEqual(ct.childNodes[1]);
		expect(storeElement[0]).toBeUndefined();
		expect(storeElement[1]).toBeUndefined();
	});

	it("function param $attribute in repeater", function () {
		var storeClass = [];
		var storeElement = [];
		ct.innerHTML = '<div data-repeat="item in items" class="{{testClass($attribute)}}">{{testElement($attribute)}}</div>';
		tpl.compile();
		tpl.scope.items = [
			{name: 'child1'},
			{name: 'child2'},
			{name: 'child3'}
		];
		tpl.scope.testClass = function(attr) {
			storeClass.push(attr);
			return '';
		};
		tpl.scope.testElement = function(attr) {
			storeElement.push(attr);
			return '';
		};
		tpl.render();
		expect(storeClass[0].name).toEqual('class');
		expect(storeClass[0].node.element).toEqual(ct.childNodes[0]);
		expect(storeClass[1].name).toEqual('class');
		expect(storeClass[1].node.element).toEqual(ct.childNodes[1]);
		expect(storeClass[2].name).toEqual('class');
		expect(storeClass[2].node.element).toEqual(ct.childNodes[2]);
		expect(storeElement[0]).toBeUndefined();
		expect(storeElement[1]).toBeUndefined();
		expect(storeElement[2]).toBeUndefined();
	});

	it("function param $scope", function () {
		var storeClass = [];
		var storeElement = [];
		ct.innerHTML = '<div class="{{testClass($scope)}}">{{testElement($scope)}}</div><div class="{{testClass($scope)}}">{{testElement($scope)}}</div>';
		tpl.compile();
		tpl.scope.testClass = function(sc) {
			storeClass.push(sc);
			return '';
		};
		tpl.scope.testElement = function(sc) {
			storeElement.push(sc);
			return '';
		};
		tpl.render();
		expect(storeClass[0]).toEqual(tpl.scope);
		expect(storeClass[1]).toEqual(tpl.scope);
		expect(storeElement[0]).toEqual(tpl.scope);
		expect(storeElement[1]).toEqual(tpl.scope);
	});

	it("function param $scope in repeater", function () {
		var storeClass = [];
		var storeElement = [];
		ct.innerHTML = '<div data-repeat="item in items" class="{{testClass($scope)}}">{{testElement($scope)}}</div>';
		tpl.compile();
		tpl.scope.items = [
			{name: 'child1'},
			{name: 'child2'},
			{name: 'child3'}
		];
		tpl.scope.testClass = function(sc) {
			storeClass.push(sc);
			return '';
		};
		tpl.scope.testElement = function(sc) {
			storeElement.push(sc);
			return '';
		};
		tpl.render();
		expect(storeClass[0].item).toEqual(tpl.scope.items[0]);
		expect(storeClass[1].item).toEqual(tpl.scope.items[1]);
		expect(storeClass[2].item).toEqual(tpl.scope.items[2]);
		expect(storeElement[0].item).toEqual(tpl.scope.items[0]);
		expect(storeElement[1].item).toEqual(tpl.scope.items[1]);
		expect(storeElement[2].item).toEqual(tpl.scope.items[2]);
	});

});
