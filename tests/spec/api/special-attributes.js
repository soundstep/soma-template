describe("api - special attributes", function () {

	beforeEach(function () {
		createContainer();
		createTemplate();
	});

	afterEach(function () {
		disposeTemplate();
		disposeContainer();
	});

	it("data-skip no value", function () {
		ct.innerHTML = '{{name}}<span data-skip>{{age}}</span>{{weight}}';
		tpl.compile();
		tpl.scope.name = 'john';
		tpl.scope.age = 21;
		tpl.scope.weight = 70;
		tpl.render();
		expect(ct.childNodes[0].nodeValue).toEqual('john');
		expect(ct.childNodes[1].innerHTML).toEqual('{{age}}');
		expect(ct.childNodes[2].nodeValue).toEqual('70');
	});

	it("data-skip true", function () {
		ct.innerHTML = '{{name}}<span data-skip="true">{{age}}</span>{{weight}}';
		tpl.compile();
		tpl.scope.name = 'john';
		tpl.scope.age = 21;
		tpl.scope.weight = 70;
		tpl.render();
		expect(ct.childNodes[0].nodeValue).toEqual('john');
		expect(ct.childNodes[1].innerHTML).toEqual('{{age}}');
		expect(ct.childNodes[2].nodeValue).toEqual('70');
	});

	it("data-skip false", function () {
		ct.innerHTML = '{{name}}<span data-skip="false">{{age}}</span>{{weight}}';
		tpl.compile();
		tpl.scope.name = 'john';
		tpl.scope.age = 21;
		tpl.scope.weight = 70;
		tpl.render();
		expect(ct.childNodes[0].nodeValue).toEqual('john');
		expect(ct.childNodes[1].innerHTML).toEqual('21');
		expect(ct.childNodes[2].nodeValue).toEqual('70');
	});

	it("data-src", function () {
		ct.innerHTML = '<span data-src="assets/{{img}}"></span>';
		tpl.compile();
		tpl.scope.img = 'image.jpg';
		tpl.render();
		expect(ct.firstChild.getAttribute('src')).toEqual('assets/image.jpg');
	});

	it("data-href", function () {
		ct.innerHTML = '<a data-href="http://{{link}}"></span>';
		tpl.compile();
		tpl.scope.link = 'www.soundstep.com';
		tpl.render();
		expect(ct.firstChild.getAttribute('href')).toEqual('http://www.soundstep.com');
	});

	it("data-show no value", function () {
		ct.innerHTML = '<div data-show></span>';
		tpl.compile();
		tpl.render();
		expect(ct.firstChild.style.display).toEqual('block');
	});

	it("data-show true", function () {
		ct.innerHTML = '<div data-show="true"></span>';
		tpl.compile();
		tpl.render();
		expect(ct.firstChild.style.display).toEqual('block');
	});

	it("data-show false", function () {
		ct.innerHTML = '<div data-show="false"></span>';
		tpl.compile();
		tpl.render();
		expect(ct.firstChild.style.display).toEqual('none');
	});

	it("data-hide no value", function () {
		ct.innerHTML = '<div data-hide></span>';
		tpl.compile();
		tpl.render();
		expect(ct.firstChild.style.display).toEqual('none');
	});

	it("data-hide true", function () {
		ct.innerHTML = '<div data-hide="true"></span>';
		tpl.compile();
		tpl.render();
		expect(ct.firstChild.style.display).toEqual('none');
	});

	it("data-hide false", function () {
		ct.innerHTML = '<div data-hide="false"></span>';
		tpl.compile();
		tpl.render();
		expect(ct.firstChild.style.display).toEqual('block');
	});

	it("data-checked no value", function () {
		ct.innerHTML = '<input type="checkbox" data-checked/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) {
			expect(ct.firstChild.getAttribute('checked')).toBeTruthy();
		}
		else if (ie === 8) {
			expect(ct.firstChild.getAttribute('checked')).toEqual('');
		}
		else {
			expect(ct.firstChild.getAttribute('checked')).toEqual('checked');
		}
	});

	it("data-checked true", function () {
		ct.innerHTML = '<input type="checkbox" data-checked="true"/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) {
			expect(ct.firstChild.getAttribute('checked')).toBeTruthy();
		}
		else if (ie === 8) {
			expect(ct.firstChild.getAttribute('checked')).toEqual('');
		}
		else {
			expect(ct.firstChild.getAttribute('checked')).toEqual('checked');
		}
	});

	it("data-checked false", function () {
		ct.innerHTML = '<input type="checkbox" data-checked="false"/>';
		tpl.compile();
		tpl.render();
		if (ct.canHaveChildren) {
			// IE
			expect(ct.firstChild.getAttribute('checked')).toBeFalsy();
		}
		else {
			expect(ct.firstChild.getAttribute('checked')).toBeNull();
		}
	});

	it("data-disabled no value", function () {
		ct.innerHTML = '<input type="checkbox" data-disabled/>';
		tpl.compile();
		tpl.render();
		if (ct.canHaveChildren) {
			// IE
			expect(ct.firstChild.getAttribute('disabled')).toBeTruthy();
		}
		else {
			expect(ct.firstChild.getAttribute('disabled')).toEqual('disabled');
		}
	});

	it("data-disabled true", function () {
		ct.innerHTML = '<input type="checkbox" data-disabled="true"/>';
		tpl.compile();
		tpl.render();
		if (ct.canHaveChildren) {
			// IE
			expect(ct.firstChild.getAttribute('disabled')).toBeTruthy();
		}
		else {
			expect(ct.firstChild.getAttribute('disabled')).toEqual('disabled');
		}
	});

	it("data-disabled false", function () {
		ct.innerHTML = '<input type="checkbox" data-disabled="false"/>';
		tpl.compile();
		tpl.render();
		if (ct.canHaveChildren) {
			// IE
			expect(ct.firstChild.getAttribute('disabled')).toBeFalsy();
		}
		else {
			expect(ct.firstChild.getAttribute('disabled')).toBeNull();
		}
	});

	it("data-multiple no value", function () {
		ct.innerHTML = '<input type="checkbox" data-multiple/>';
		tpl.compile();
		tpl.render();
		expect(ct.firstChild.getAttribute('multiple')).toEqual('multiple');
	});

	it("data-multiple true", function () {
		ct.innerHTML = '<input type="checkbox" data-multiple="true"/>';
		tpl.compile();
		tpl.render();
		expect(ct.firstChild.getAttribute('multiple')).toEqual('multiple');
	});

	it("data-multiple false", function () {
		ct.innerHTML = '<input type="checkbox" data-multiple="false"/>';
		tpl.compile();
		tpl.render();
		expect(ct.firstChild.getAttribute('multiple')).toBeNull();
	});

	it("data-readonly no value", function () {
		ct.innerHTML = '<input type="checkbox" data-readonly/>';
		tpl.compile();
		tpl.render();
		if (ct.canHaveChildren) {
			// IE
			expect(ct.firstChild.getAttribute('readonly')).toBeTruthy();
		}
		else {
			expect(ct.firstChild.getAttribute('readonly')).toEqual('readonly');
		}
	});

	it("data-readonly true", function () {
		ct.innerHTML = '<input type="checkbox" data-readonly="true"/>';
		tpl.compile();
		tpl.render();
		if (ct.canHaveChildren) {
			// IE
			expect(ct.firstChild.getAttribute('readonly')).toBeTruthy();
		}
		else {
			expect(ct.firstChild.getAttribute('readonly')).toEqual('readonly');
		}
	});

	it("data-readonly false", function () {
		ct.innerHTML = '<input type="checkbox" data-readonly="false"/>';
		tpl.compile();
		tpl.render();
		if (ct.canHaveChildren) {
			// IE
			expect(ct.firstChild.getAttribute('readonly')).toBeFalsy();
		}
		else {
			expect(ct.firstChild.getAttribute('readonly')).toBeNull();
		}
	});

	it("data-selected no value", function () {
		ct.innerHTML = '<input type="checkbox" data-selected/>';
		tpl.compile();
		tpl.render();
		expect(ct.firstChild.getAttribute('selected')).toEqual('selected');
	});

	it("data-selected true", function () {
		ct.innerHTML = '<input type="checkbox" data-selected="true"/>';
		tpl.compile();
		tpl.render();
		expect(ct.firstChild.getAttribute('selected')).toEqual('selected');
	});

	it("data-selected false", function () {
		ct.innerHTML = '<input type="checkbox" data-selected="false"/>';
		tpl.compile();
		tpl.render();
		expect(ct.firstChild.getAttribute('selected')).toBeNull();
	});

	it("data-cloak", function () {
		ct.innerHTML = '<div class="data-cloak">{{name}}</span>';
		tpl.compile();
		if (ct.canHaveChildren) {
			expect(ct.firstChild.className).toEqual('data-cloak');
		}
		else {
			expect(ct.firstChild.getAttribute('class')).toEqual('data-cloak');
		}
		tpl.render();
		if (ct.canHaveChildren) {
			expect(ct.firstChild.className).toEqual('');
		}
		else {
			expect(ct.firstChild.getAttribute('class')).not.toEqual('data-cloak');
		}
	});

	it("data-repeat", function () {
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
				["0-0-0", "0-0-1", "0-0-2"],
				["0-1-0", "0-1-1", "0-1-2"],
				["0-2-0", "0-2-1", "0-2-2"]
			],
			[
				["1-0-0", "1-0-1", "1-0-2"],
				["1-1-0", "1-1-1", "1-1-2"],
				["1-2-0", "1-2-1", "1-2-2"]
			],
			[
				["2-0-0", "2-0-1", "2-0-2"],
				["2-1-0", "2-1-1", "2-1-2"],
				["2-2-0", "2-2-1", "2-2-2"]
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
		expect(ul_1_1.childNodes[0].firstChild.nodeValue).toEqual('Level 3, index 0: 0-0-0');
		expect(ul_1_1.childNodes[1].firstChild.nodeValue).toEqual('Level 3, index 1: 0-0-1');
		expect(ul_1_1.childNodes[2].firstChild.nodeValue).toEqual('Level 3, index 2: 0-0-2');
		var ul_1_2 = ul_1.childNodes[1].childNodes[1];
		expect(ul_1_2.childNodes[0].firstChild.nodeValue).toEqual('Level 3, index 0: 0-1-0');
		expect(ul_1_2.childNodes[1].firstChild.nodeValue).toEqual('Level 3, index 1: 0-1-1');
		expect(ul_1_2.childNodes[2].firstChild.nodeValue).toEqual('Level 3, index 2: 0-1-2');
		var ul_1_3 = ul_1.childNodes[2].childNodes[1];
		expect(ul_1_3.childNodes[0].firstChild.nodeValue).toEqual('Level 3, index 0: 0-2-0');
		expect(ul_1_3.childNodes[1].firstChild.nodeValue).toEqual('Level 3, index 1: 0-2-1');
		expect(ul_1_3.childNodes[2].firstChild.nodeValue).toEqual('Level 3, index 2: 0-2-2');
		// level 3
		var ul_2_1 = ul_2.childNodes[0].childNodes[1];
		expect(ul_2_1.childNodes[0].firstChild.nodeValue).toEqual('Level 3, index 0: 1-0-0');
		expect(ul_2_1.childNodes[1].firstChild.nodeValue).toEqual('Level 3, index 1: 1-0-1');
		expect(ul_2_1.childNodes[2].firstChild.nodeValue).toEqual('Level 3, index 2: 1-0-2');
		var ul_2_2 = ul_2.childNodes[1].childNodes[1];
		expect(ul_2_2.childNodes[0].firstChild.nodeValue).toEqual('Level 3, index 0: 1-1-0');
		expect(ul_2_2.childNodes[1].firstChild.nodeValue).toEqual('Level 3, index 1: 1-1-1');
		expect(ul_2_2.childNodes[2].firstChild.nodeValue).toEqual('Level 3, index 2: 1-1-2');
		var ul_2_3 = ul_2.childNodes[2].childNodes[1];
		expect(ul_2_3.childNodes[0].firstChild.nodeValue).toEqual('Level 3, index 0: 1-2-0');
		expect(ul_2_3.childNodes[1].firstChild.nodeValue).toEqual('Level 3, index 1: 1-2-1');
		expect(ul_2_3.childNodes[2].firstChild.nodeValue).toEqual('Level 3, index 2: 1-2-2');
		// level 3
		var ul_3_1 = ul_3.childNodes[0].childNodes[1];
		expect(ul_3_1.childNodes[0].firstChild.nodeValue).toEqual('Level 3, index 0: 2-0-0');
		expect(ul_3_1.childNodes[1].firstChild.nodeValue).toEqual('Level 3, index 1: 2-0-1');
		expect(ul_3_1.childNodes[2].firstChild.nodeValue).toEqual('Level 3, index 2: 2-0-2');
		var ul_3_2 = ul_3.childNodes[1].childNodes[1];
		expect(ul_3_2.childNodes[0].firstChild.nodeValue).toEqual('Level 3, index 0: 2-1-0');
		expect(ul_3_2.childNodes[1].firstChild.nodeValue).toEqual('Level 3, index 1: 2-1-1');
		expect(ul_3_2.childNodes[2].firstChild.nodeValue).toEqual('Level 3, index 2: 2-1-2');
		var ul_3_3 = ul_3.childNodes[2].childNodes[1];
		expect(ul_3_3.childNodes[0].firstChild.nodeValue).toEqual('Level 3, index 0: 2-2-0');
		expect(ul_3_3.childNodes[1].firstChild.nodeValue).toEqual('Level 3, index 1: 2-2-1');
		expect(ul_3_3.childNodes[2].firstChild.nodeValue).toEqual('Level 3, index 2: 2-2-2');
	});

	it("data-repeat direct access", function () {
		ct.innerHTML =
			'<ul>' +
				'<li data-repeat="item1 in items">' +
					'Level 1, index {{$index}}' +
					'<ul>' +
						'<li data-repeat="item2 in item1">' +
							'Level 2, index {{$index}}' +
							'<ul>' +
								'<li data-repeat="items3 in item2">' +
									'{{item2[0]}} {{item2[1]}} {{item2[2]}}' +
								'</li>' +
							'</ul>' +
						'</li>' +
					'</ul>' +
				'</li>' +
			'</ul>';
		tpl.compile();
		tpl.scope.items = [
			[
				["0-0-0", "0-0-1", "0-0-2"],
				["0-1-0", "0-1-1", "0-1-2"],
				["0-2-0", "0-2-1", "0-2-2"]
			],
			[
				["1-0-0", "1-0-1", "1-0-2"],
				["1-1-0", "1-1-1", "1-1-2"],
				["1-2-0", "1-2-1", "1-2-2"]
			],
			[
				["2-0-0", "2-0-1", "2-0-2"],
				["2-1-0", "2-1-1", "2-1-2"],
				["2-2-0", "2-2-1", "2-2-2"]
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
		expect(ul_1_1.childNodes[0].firstChild.nodeValue).toEqual('0-0-0 0-0-1 0-0-2');
		expect(ul_1_1.childNodes[1].firstChild.nodeValue).toEqual('0-0-0 0-0-1 0-0-2');
		expect(ul_1_1.childNodes[2].firstChild.nodeValue).toEqual('0-0-0 0-0-1 0-0-2');
		var ul_1_2 = ul_1.childNodes[1].childNodes[1];
		expect(ul_1_2.childNodes[0].firstChild.nodeValue).toEqual('0-1-0 0-1-1 0-1-2');
		expect(ul_1_2.childNodes[1].firstChild.nodeValue).toEqual('0-1-0 0-1-1 0-1-2');
		expect(ul_1_2.childNodes[2].firstChild.nodeValue).toEqual('0-1-0 0-1-1 0-1-2');
		var ul_1_3 = ul_1.childNodes[2].childNodes[1];
		expect(ul_1_3.childNodes[0].firstChild.nodeValue).toEqual('0-2-0 0-2-1 0-2-2');
		expect(ul_1_3.childNodes[1].firstChild.nodeValue).toEqual('0-2-0 0-2-1 0-2-2');
		expect(ul_1_3.childNodes[2].firstChild.nodeValue).toEqual('0-2-0 0-2-1 0-2-2');
		// level 3
		var ul_2_1 = ul_2.childNodes[0].childNodes[1];
		expect(ul_2_1.childNodes[0].firstChild.nodeValue).toEqual('1-0-0 1-0-1 1-0-2');
		expect(ul_2_1.childNodes[1].firstChild.nodeValue).toEqual('1-0-0 1-0-1 1-0-2');
		expect(ul_2_1.childNodes[2].firstChild.nodeValue).toEqual('1-0-0 1-0-1 1-0-2');
		var ul_2_2 = ul_2.childNodes[1].childNodes[1];
		expect(ul_2_2.childNodes[0].firstChild.nodeValue).toEqual('1-1-0 1-1-1 1-1-2');
		expect(ul_2_2.childNodes[1].firstChild.nodeValue).toEqual('1-1-0 1-1-1 1-1-2');
		expect(ul_2_2.childNodes[2].firstChild.nodeValue).toEqual('1-1-0 1-1-1 1-1-2');
		var ul_2_3 = ul_2.childNodes[2].childNodes[1];
		expect(ul_2_3.childNodes[0].firstChild.nodeValue).toEqual('1-2-0 1-2-1 1-2-2');
		expect(ul_2_3.childNodes[1].firstChild.nodeValue).toEqual('1-2-0 1-2-1 1-2-2');
		expect(ul_2_3.childNodes[2].firstChild.nodeValue).toEqual('1-2-0 1-2-1 1-2-2');
		// level 3
		var ul_3_1 = ul_3.childNodes[0].childNodes[1];
		expect(ul_3_1.childNodes[0].firstChild.nodeValue).toEqual('2-0-0 2-0-1 2-0-2');
		expect(ul_3_1.childNodes[1].firstChild.nodeValue).toEqual('2-0-0 2-0-1 2-0-2');
		expect(ul_3_1.childNodes[2].firstChild.nodeValue).toEqual('2-0-0 2-0-1 2-0-2');
		var ul_3_2 = ul_3.childNodes[1].childNodes[1];
		expect(ul_3_2.childNodes[0].firstChild.nodeValue).toEqual('2-1-0 2-1-1 2-1-2');
		expect(ul_3_2.childNodes[1].firstChild.nodeValue).toEqual('2-1-0 2-1-1 2-1-2');
		expect(ul_3_2.childNodes[2].firstChild.nodeValue).toEqual('2-1-0 2-1-1 2-1-2');
		var ul_3_3 = ul_3.childNodes[2].childNodes[1];
		expect(ul_3_3.childNodes[0].firstChild.nodeValue).toEqual('2-2-0 2-2-1 2-2-2');
		expect(ul_3_3.childNodes[1].firstChild.nodeValue).toEqual('2-2-0 2-2-1 2-2-2');
		expect(ul_3_3.childNodes[2].firstChild.nodeValue).toEqual('2-2-0 2-2-1 2-2-2');

	});



});
