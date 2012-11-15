describe("api - rendering", function () {

	beforeEach(function () {
		createContainer();
		createTemplate();
	});

	afterEach(function () {
		disposeTemplate();
		disposeContainer();
	});

	it("text node value", function () {
		ct.innerHTML = "{{name}}";
		tpl.compile();
		tpl.scope.name = "john";
		tpl.render();
		expect(ct.innerHTML).toEqual('john');
		tpl.scope.name = "david";
		tpl.render();
		expect(ct.innerHTML).toEqual('david');
	});

	it("text node multiple values", function () {
		ct.innerHTML = "my name is {{name}} and my age is {{age}}";
		tpl.compile();
		tpl.scope.name = "john";
		tpl.scope.age = 21;
		tpl.render();
		expect(ct.innerHTML).toEqual('my name is john and my age is 21');
		tpl.scope.name = "david";
		tpl.scope.age = 22;
		tpl.render();
		expect(ct.innerHTML).toEqual('my name is david and my age is 22');
	});

	it("attribute name", function () {
		ct.innerHTML = '<p {{name}}="value"></p>';
		tpl.compile();
		tpl.scope.name = "data-id";
		tpl.render();
		expect(ct.firstChild.getAttribute('data-id')).toEqual('value');
		expect(ct.innerHTML).toEqual('<p data-id="value"></p>');
		tpl.scope.name = "data-name";
		tpl.render();
		expect(ct.firstChild.getAttribute('data-id')).toBeNull();
		expect(ct.firstChild.getAttribute('data-name')).toEqual('value');
		expect(ct.innerHTML).toEqual('<p data-name="value"></p>');
	});

	it("attribute multiple name", function () {
		ct.innerHTML = '<p {{name}}-{{id}}="value"></p>';
		tpl.compile();
		tpl.scope.name = "data";
		tpl.scope.id = "id";
		tpl.render();
		expect(ct.firstChild.getAttribute('data-id')).toEqual('value');
		expect(ct.innerHTML).toEqual('<p data-id="value"></p>');
		tpl.scope.name = "data2";
		tpl.scope.id = "id2";
		tpl.render();
		expect(ct.firstChild.getAttribute('data-id')).toBeNull();
		expect(ct.firstChild.getAttribute('data2-id2')).toEqual('value');
		expect(ct.innerHTML).toEqual('<p data2-id2="value"></p>');
	});

	it("attribute value", function () {
		ct.innerHTML = '<p data-name="{{name}}"></p>';
		tpl.compile();
		tpl.scope.name = "john";
		tpl.render();
		expect(ct.firstChild.getAttribute('data-name')).toEqual('john');
		expect(ct.innerHTML).toEqual('<p data-name="john"></p>');
		tpl.scope.name = "david";
		tpl.render();
		expect(ct.firstChild.getAttribute('data-name')).toEqual('david');
		expect(ct.innerHTML).toEqual('<p data-name="david"></p>');
	});

	it("attribute multiple values", function () {
		ct.innerHTML = '<p data-name="data: {{name}} {{age}}"></p>';
		tpl.compile();
		tpl.scope.name = "john";
		tpl.scope.age = 21;
		tpl.render();
		expect(ct.firstChild.getAttribute('data-name')).toEqual('data: john 21');
		expect(ct.innerHTML).toEqual('<p data-name="data: john 21"></p>');
		tpl.scope.name = "david";
		tpl.scope.age = 22;
		tpl.render();
		expect(ct.firstChild.getAttribute('data-name')).toEqual('data: david 22');
		expect(ct.innerHTML).toEqual('<p data-name="data: david 22"></p>');
	});

	it("function", function () {
		ct.innerHTML = "{{name()}}";
		tpl.compile();
		tpl.scope.name = function() { return 'john'; };
		tpl.render();
		expect(ct.innerHTML).toEqual('john');
		tpl.scope.name = function() { return 'david'; };
		tpl.render();
		expect(ct.innerHTML).toEqual('david');
	});

	it("function path", function () {
		ct.innerHTML = "{{content.path.name()}}";
		tpl.compile();
		tpl.scope.content = { path: {name: function() { return 'john'; } } };
		tpl.render();
		expect(ct.innerHTML).toEqual('john');
		tpl.scope.content = { path: {name: function() { return 'david'; } } };
		tpl.render();
		expect(ct.innerHTML).toEqual('david');
	});

	it("function param", function () {
		ct.innerHTML = "{{name('john', age)}}";
		tpl.compile();
		tpl.scope.age = 21;
		tpl.scope.name = function(n, a) { return n + ' ' + a; };
		tpl.render();
		expect(ct.innerHTML).toEqual('john 21');
		tpl.scope.age = 22;
		tpl.scope.name = function(n, a) { return n + ' ' + a; };
		tpl.render();
		expect(ct.innerHTML).toEqual('john 22');
	});

	it("function param with path", function () {
		ct.innerHTML = "{{content.path.name('path.john', path.age)}}";
		tpl.compile();
		tpl.scope.path = {age: 21};
		tpl.scope.content = { path: {name: function(n, a) { return n + ' ' + a; } } };
		tpl.render();
		expect(ct.innerHTML).toEqual('path.john 21');
		tpl.scope.path = {age: 22};
		tpl.scope.content = { path: {name: function(n, a) { return n + ' ' + a; } } };
		tpl.render();
		expect(ct.innerHTML).toEqual('path.john 22');
	});

	it("data-src", function () {
		ct.innerHTML = '<span data-src="{{data}}"></span>';
		tpl.compile();
		tpl.scope.data = "image.jpg";
		tpl.render();
		expect(ct.firstChild.getAttribute('src')).toEqual('image.jpg');
		tpl.scope.data = "image2.jpg";
		tpl.render();
		expect(ct.firstChild.getAttribute('src')).toEqual('image2.jpg');
	});

	it("data-href", function () {
		ct.innerHTML = '<span data-href="{{data}}"></span>';
		tpl.compile();
		tpl.scope.data = "http://www.soundstep.com";
		tpl.render();
		expect(ct.firstChild.getAttribute('href')).toEqual('http://www.soundstep.com');
		tpl.scope.data = "http://www.google.com";
		tpl.render();
		expect(ct.firstChild.getAttribute('href')).toEqual('http://www.google.com');
	});

	it("data-repeat", function() {
		ct.innerHTML =
			'<ul>' +
				'<li data-repeat="item1 in items">' +
				'Level 1, index {{$index}}' +
				'<ul>' +
				'<li data-repeat="item2 in item1">' +
				'Level 2, index {{$index}}' +
				'<ul>' +
				'<li data-repeat="items3 in item2">' +
				'Level 3, index {{$index}}: {{items3}}' +
				'</li>' +
				'</ul>' +
				'</li>' +
				'</ul>' +
				'</li>' +
				'</ul>';
		tpl.compile();
		tpl.scope.items = [
			[
					["0-0-0 [v1]", "0-0-1 [v1]", "0-0-2 [v1]"],
					["0-1-0 [v1]", "0-1-1 [v1]", "0-1-2 [v1]"],
					["0-2-0 [v1]", "0-2-1 [v1]", "0-2-2 [v1]"]
				],
				[
					["1-0-0 [v1]", "1-0-1 [v1]", "1-0-2 [v1]"],
					["1-1-0 [v1]", "1-1-1 [v1]", "1-1-2 [v1]"],
					["1-2-0 [v1]", "1-2-1 [v1]", "1-2-2 [v1]"]
				],
				[
					["2-0-0 [v1]", "2-0-1 [v1]", "2-0-2 [v1]"],
					["2-1-0 [v1]", "2-1-1 [v1]", "2-1-2 [v1]"],
					["2-2-0 [v1]", "2-2-1 [v1]", "2-2-2 [v1]"]
			]
		];
		tpl.render();
		// level 1
		var ul = ct.childNodes[0];
		expect(ul.childNodes[0].firstChild.nodeValue).toEqual('Level 1, index 0');
		expect(ul.childNodes[1].firstChild.nodeValue).toEqual('Level 1, index 1');
		expect(ul.childNodes[2].firstChild.nodeValue).toEqual('Level 1, index 2');
		// level 2
		var ul_1 = ul.childNodes[0].childNodes[1];
		expect(ul_1.childNodes[0].firstChild.nodeValue).toEqual('Level 2, index 0');
		expect(ul_1.childNodes[1].firstChild.nodeValue).toEqual('Level 2, index 1');
		expect(ul_1.childNodes[2].firstChild.nodeValue).toEqual('Level 2, index 2');
		var ul_2 = ul.childNodes[1].childNodes[1];
		expect(ul_2.childNodes[0].firstChild.nodeValue).toEqual('Level 2, index 0');
		expect(ul_2.childNodes[1].firstChild.nodeValue).toEqual('Level 2, index 1');
		expect(ul_2.childNodes[2].firstChild.nodeValue).toEqual('Level 2, index 2');
		var ul_3 = ul.childNodes[2].childNodes[1];
		expect(ul_3.childNodes[0].firstChild.nodeValue).toEqual('Level 2, index 0');
		expect(ul_3.childNodes[1].firstChild.nodeValue).toEqual('Level 2, index 1');
		expect(ul_3.childNodes[2].firstChild.nodeValue).toEqual('Level 2, index 2');
		// level 3
		var ul_1_1 = ul_1.childNodes[0].childNodes[1];
		expect(ul_1_1.childNodes[0].firstChild.nodeValue).toEqual('Level 3, index 0: 0-0-0 [v1]');
		expect(ul_1_1.childNodes[1].firstChild.nodeValue).toEqual('Level 3, index 1: 0-0-1 [v1]');
		expect(ul_1_1.childNodes[2].firstChild.nodeValue).toEqual('Level 3, index 2: 0-0-2 [v1]');
		var ul_1_2 = ul_1.childNodes[1].childNodes[1];
		expect(ul_1_2.childNodes[0].firstChild.nodeValue).toEqual('Level 3, index 0: 0-1-0 [v1]');
		expect(ul_1_2.childNodes[1].firstChild.nodeValue).toEqual('Level 3, index 1: 0-1-1 [v1]');
		expect(ul_1_2.childNodes[2].firstChild.nodeValue).toEqual('Level 3, index 2: 0-1-2 [v1]');
		var ul_1_3 = ul_1.childNodes[2].childNodes[1];
		expect(ul_1_3.childNodes[0].firstChild.nodeValue).toEqual('Level 3, index 0: 0-2-0 [v1]');
		expect(ul_1_3.childNodes[1].firstChild.nodeValue).toEqual('Level 3, index 1: 0-2-1 [v1]');
		expect(ul_1_3.childNodes[2].firstChild.nodeValue).toEqual('Level 3, index 2: 0-2-2 [v1]');
		// level 3
		var ul_2_1 = ul_2.childNodes[0].childNodes[1];
		expect(ul_2_1.childNodes[0].firstChild.nodeValue).toEqual('Level 3, index 0: 1-0-0 [v1]');
		expect(ul_2_1.childNodes[1].firstChild.nodeValue).toEqual('Level 3, index 1: 1-0-1 [v1]');
		expect(ul_2_1.childNodes[2].firstChild.nodeValue).toEqual('Level 3, index 2: 1-0-2 [v1]');
		var ul_2_2 = ul_2.childNodes[1].childNodes[1];
		expect(ul_2_2.childNodes[0].firstChild.nodeValue).toEqual('Level 3, index 0: 1-1-0 [v1]');
		expect(ul_2_2.childNodes[1].firstChild.nodeValue).toEqual('Level 3, index 1: 1-1-1 [v1]');
		expect(ul_2_2.childNodes[2].firstChild.nodeValue).toEqual('Level 3, index 2: 1-1-2 [v1]');
		var ul_2_3 = ul_2.childNodes[2].childNodes[1];
		expect(ul_2_3.childNodes[0].firstChild.nodeValue).toEqual('Level 3, index 0: 1-2-0 [v1]');
		expect(ul_2_3.childNodes[1].firstChild.nodeValue).toEqual('Level 3, index 1: 1-2-1 [v1]');
		expect(ul_2_3.childNodes[2].firstChild.nodeValue).toEqual('Level 3, index 2: 1-2-2 [v1]');
		// level 3
		var ul_3_1 = ul_3.childNodes[0].childNodes[1];
		expect(ul_3_1.childNodes[0].firstChild.nodeValue).toEqual('Level 3, index 0: 2-0-0 [v1]');
		expect(ul_3_1.childNodes[1].firstChild.nodeValue).toEqual('Level 3, index 1: 2-0-1 [v1]');
		expect(ul_3_1.childNodes[2].firstChild.nodeValue).toEqual('Level 3, index 2: 2-0-2 [v1]');
		var ul_3_2 = ul_3.childNodes[1].childNodes[1];
		expect(ul_3_2.childNodes[0].firstChild.nodeValue).toEqual('Level 3, index 0: 2-1-0 [v1]');
		expect(ul_3_2.childNodes[1].firstChild.nodeValue).toEqual('Level 3, index 1: 2-1-1 [v1]');
		expect(ul_3_2.childNodes[2].firstChild.nodeValue).toEqual('Level 3, index 2: 2-1-2 [v1]');
		var ul_3_3 = ul_3.childNodes[2].childNodes[1];
		expect(ul_3_3.childNodes[0].firstChild.nodeValue).toEqual('Level 3, index 0: 2-2-0 [v1]');
		expect(ul_3_3.childNodes[1].firstChild.nodeValue).toEqual('Level 3, index 1: 2-2-1 [v1]');
		expect(ul_3_3.childNodes[2].firstChild.nodeValue).toEqual('Level 3, index 2: 2-2-2 [v1]');
		tpl.scope.items = [
			[
					["0-0-0 [v2]", "0-0-1 [v2]", "0-0-2 [v2]"],
					["0-1-0 [v2]", "0-1-1 [v2]", "0-1-2 [v2]"],
					["0-2-0 [v2]", "0-2-1 [v2]", "0-2-2 [v2]"]
				],
				[
					["1-0-0 [v2]", "1-0-1 [v2]", "1-0-2 [v2]"],
					["1-1-0 [v2]", "1-1-1 [v2]", "1-1-2 [v2]"],
					["1-2-0 [v2]", "1-2-1 [v2]", "1-2-2 [v2]"]
				],
				[
					["2-0-0 [v2]", "2-0-1 [v2]", "2-0-2 [v2]"],
					["2-1-0 [v2]", "2-1-1 [v2]", "2-1-2 [v2]"],
					["2-2-0 [v2]", "2-2-1 [v2]", "2-2-2 [v2]"]
			]
		];
		tpl.render();
		// level 1
		ul = ct.childNodes[0];
		expect(ul.childNodes[0].firstChild.nodeValue).toEqual('Level 1, index 0');
		expect(ul.childNodes[1].firstChild.nodeValue).toEqual('Level 1, index 1');
		expect(ul.childNodes[2].firstChild.nodeValue).toEqual('Level 1, index 2');
		// level 2
		ul_1 = ul.childNodes[0].childNodes[1];
		expect(ul_1.childNodes[0].firstChild.nodeValue).toEqual('Level 2, index 0');
		expect(ul_1.childNodes[1].firstChild.nodeValue).toEqual('Level 2, index 1');
		expect(ul_1.childNodes[2].firstChild.nodeValue).toEqual('Level 2, index 2');
		ul_2 = ul.childNodes[1].childNodes[1];
		expect(ul_2.childNodes[0].firstChild.nodeValue).toEqual('Level 2, index 0');
		expect(ul_2.childNodes[1].firstChild.nodeValue).toEqual('Level 2, index 1');
		expect(ul_2.childNodes[2].firstChild.nodeValue).toEqual('Level 2, index 2');
		ul_3 = ul.childNodes[2].childNodes[1];
		expect(ul_3.childNodes[0].firstChild.nodeValue).toEqual('Level 2, index 0');
		expect(ul_3.childNodes[1].firstChild.nodeValue).toEqual('Level 2, index 1');
		expect(ul_3.childNodes[2].firstChild.nodeValue).toEqual('Level 2, index 2');
		// level 3
		ul_1_1 = ul_1.childNodes[0].childNodes[1];
		expect(ul_1_1.childNodes[0].firstChild.nodeValue).toEqual('Level 3, index 0: 0-0-0 [v2]');
		expect(ul_1_1.childNodes[1].firstChild.nodeValue).toEqual('Level 3, index 1: 0-0-1 [v2]');
		expect(ul_1_1.childNodes[2].firstChild.nodeValue).toEqual('Level 3, index 2: 0-0-2 [v2]');
		ul_1_2 = ul_1.childNodes[1].childNodes[1];
		expect(ul_1_2.childNodes[0].firstChild.nodeValue).toEqual('Level 3, index 0: 0-1-0 [v2]');
		expect(ul_1_2.childNodes[1].firstChild.nodeValue).toEqual('Level 3, index 1: 0-1-1 [v2]');
		expect(ul_1_2.childNodes[2].firstChild.nodeValue).toEqual('Level 3, index 2: 0-1-2 [v2]');
		ul_1_3 = ul_1.childNodes[2].childNodes[1];
		expect(ul_1_3.childNodes[0].firstChild.nodeValue).toEqual('Level 3, index 0: 0-2-0 [v2]');
		expect(ul_1_3.childNodes[1].firstChild.nodeValue).toEqual('Level 3, index 1: 0-2-1 [v2]');
		expect(ul_1_3.childNodes[2].firstChild.nodeValue).toEqual('Level 3, index 2: 0-2-2 [v2]');
		// level 3
		ul_2_1 = ul_2.childNodes[0].childNodes[1];
		expect(ul_2_1.childNodes[0].firstChild.nodeValue).toEqual('Level 3, index 0: 1-0-0 [v2]');
		expect(ul_2_1.childNodes[1].firstChild.nodeValue).toEqual('Level 3, index 1: 1-0-1 [v2]');
		expect(ul_2_1.childNodes[2].firstChild.nodeValue).toEqual('Level 3, index 2: 1-0-2 [v2]');
		ul_2_2 = ul_2.childNodes[1].childNodes[1];
		expect(ul_2_2.childNodes[0].firstChild.nodeValue).toEqual('Level 3, index 0: 1-1-0 [v2]');
		expect(ul_2_2.childNodes[1].firstChild.nodeValue).toEqual('Level 3, index 1: 1-1-1 [v2]');
		expect(ul_2_2.childNodes[2].firstChild.nodeValue).toEqual('Level 3, index 2: 1-1-2 [v2]');
		ul_2_3 = ul_2.childNodes[2].childNodes[1];
		expect(ul_2_3.childNodes[0].firstChild.nodeValue).toEqual('Level 3, index 0: 1-2-0 [v2]');
		expect(ul_2_3.childNodes[1].firstChild.nodeValue).toEqual('Level 3, index 1: 1-2-1 [v2]');
		expect(ul_2_3.childNodes[2].firstChild.nodeValue).toEqual('Level 3, index 2: 1-2-2 [v2]');
		// level 3
		ul_3_1 = ul_3.childNodes[0].childNodes[1];
		expect(ul_3_1.childNodes[0].firstChild.nodeValue).toEqual('Level 3, index 0: 2-0-0 [v2]');
		expect(ul_3_1.childNodes[1].firstChild.nodeValue).toEqual('Level 3, index 1: 2-0-1 [v2]');
		expect(ul_3_1.childNodes[2].firstChild.nodeValue).toEqual('Level 3, index 2: 2-0-2 [v2]');
		ul_3_2 = ul_3.childNodes[1].childNodes[1];
		expect(ul_3_2.childNodes[0].firstChild.nodeValue).toEqual('Level 3, index 0: 2-1-0 [v2]');
		expect(ul_3_2.childNodes[1].firstChild.nodeValue).toEqual('Level 3, index 1: 2-1-1 [v2]');
		expect(ul_3_2.childNodes[2].firstChild.nodeValue).toEqual('Level 3, index 2: 2-1-2 [v2]');
		ul_3_3 = ul_3.childNodes[2].childNodes[1];
		expect(ul_3_3.childNodes[0].firstChild.nodeValue).toEqual('Level 3, index 0: 2-2-0 [v2]');
		expect(ul_3_3.childNodes[1].firstChild.nodeValue).toEqual('Level 3, index 1: 2-2-1 [v2]');
		expect(ul_3_3.childNodes[2].firstChild.nodeValue).toEqual('Level 3, index 2: 2-2-2 [v2]');
	});

	it("identical accessor in data-repeat", function() {
		ct.innerHTML =
			'<div data-repeat="item in people">' +
				'{{item.name}} {{item.age}}' +
				'<div data-repeat="item in item.people">' +
					'{{item.name}} {{item.age}}' +
					'<div data-repeat="item in item.people">' +
						'{{item.name}} {{item.age}}' +
					'</div>' +
				'</div>' +
			'</div>';
		tpl.compile();
		tpl.scope.people = [
			{
				name:"John [v1]",
				age:20,
				people: [
					{
						name:"David [v1]",
						age:25,
						people: [
							{
								name:"Mike [v1]",
								age:30
							}
						]
					}
				]
			}
		];
		tpl.render();
		expect(ct.firstChild.childNodes[0].nodeValue).toEqual('John [v1] 20');
		expect(ct.firstChild.childNodes[1].firstChild.nodeValue).toEqual('David [v1] 25');
		expect(ct.firstChild.childNodes[1].childNodes[1].firstChild.nodeValue).toEqual('Mike [v1] 30');
		tpl.scope.people = [
			{
				name:"John [v2]",
				age:20,
				people: [
					{
						name:"David [v2]",
						age:25,
						people: [
							{
								name:"Mike [v2]",
								age:30
							}
						]
					}
				]
			}
		];
		tpl.render();
		expect(ct.firstChild.childNodes[0].nodeValue).toEqual('John [v2] 20');
		expect(ct.firstChild.childNodes[1].firstChild.nodeValue).toEqual('David [v2] 25');
		expect(ct.firstChild.childNodes[1].childNodes[1].firstChild.nodeValue).toEqual('Mike [v2] 30');
	});

	it("repeat on array with index, previous and next sibling", function() {
		ct.innerHTML =
			'<ul>' +
				'<li>repeat from here:</li>' +
				'<li data-repeat="r in rep">[{{$index}}] {{r.val}}</li>' +
				'<li>repeat ends here</li>' +
			'</ul>';
		tpl.compile();
		tpl.scope.rep = [
			{val:"val A [v1]"},
			{val:"val B [v1]"},
			{val:"val C [v1]"}
		];
		tpl.render();
		expect(ct.firstChild.childNodes[0].innerHTML).toEqual('repeat from here:');
		expect(ct.firstChild.childNodes[1].innerHTML).toEqual('[0] val A [v1]');
		expect(ct.firstChild.childNodes[2].innerHTML).toEqual('[1] val B [v1]');
		expect(ct.firstChild.childNodes[3].innerHTML).toEqual('[2] val C [v1]');
		expect(ct.firstChild.childNodes[4].innerHTML).toEqual('repeat ends here');
		tpl.scope.rep = [
			{val:"val A [v2]"},
			{val:"val B [v2]"},
			{val:"val C [v2]"}
		];
		tpl.render();
		expect(ct.firstChild.childNodes[0].innerHTML).toEqual('repeat from here:');
		expect(ct.firstChild.childNodes[1].innerHTML).toEqual('[0] val A [v2]');
		expect(ct.firstChild.childNodes[2].innerHTML).toEqual('[1] val B [v2]');
		expect(ct.firstChild.childNodes[3].innerHTML).toEqual('[2] val C [v2]');
		expect(ct.firstChild.childNodes[4].innerHTML).toEqual('repeat ends here');
	});

	it("repeat on object with key, previous and next sibling", function() {
		ct.innerHTML =
			'<ul>' +
				'<li>repeat from here:</li>' +
				'<li data-repeat="r in rep">[{{$key}}] {{r}}</li>' +
				'<li>repeat ends here</li>' +
			'</ul>';
		tpl.compile();
		tpl.scope.rep = {
			item1: "val A [v1]",
			item2: "val B [v1]",
			item3: "val C [v1]"
		};
		tpl.render();
		expect(ct.firstChild.childNodes[0].innerHTML).toEqual('repeat from here:');
		expect(ct.firstChild.childNodes[1].innerHTML).toEqual('[item1] val A [v1]');
		expect(ct.firstChild.childNodes[2].innerHTML).toEqual('[item2] val B [v1]');
		expect(ct.firstChild.childNodes[3].innerHTML).toEqual('[item3] val C [v1]');
		expect(ct.firstChild.childNodes[4].innerHTML).toEqual('repeat ends here');
		tpl.scope.rep = {
			item1: "val A [v2]",
			item2: "val B [v2]",
			item3: "val C [v2]"
		};
		tpl.render();
		expect(ct.firstChild.childNodes[0].innerHTML).toEqual('repeat from here:');
		expect(ct.firstChild.childNodes[1].innerHTML).toEqual('[item1] val A [v2]');
		expect(ct.firstChild.childNodes[2].innerHTML).toEqual('[item2] val B [v2]');
		expect(ct.firstChild.childNodes[3].innerHTML).toEqual('[item3] val C [v2]');
		expect(ct.firstChild.childNodes[4].innerHTML).toEqual('repeat ends here');
	});

});
