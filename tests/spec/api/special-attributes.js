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
		// no value is false
		ct.innerHTML = '{{name}}<span data-skip>{{age}}</span>{{weight}}';
		tpl.compile();
		tpl.scope.name = 'john';
		tpl.scope.age = 21;
		tpl.scope.weight = 70;
		tpl.render();
		expect(ct.childNodes[0].nodeValue).toEqual('john');
		expect(ct.childNodes[1].innerHTML).toEqual('21');
		expect(ct.childNodes[2].nodeValue).toEqual('70');
	});

	it("data-skip empty string", function () {
		// empty string is false
		ct.innerHTML = '{{name}}<span data-skip="">{{age}}</span>{{weight}}';
		tpl.compile();
		tpl.scope.name = 'john';
		tpl.scope.age = 21;
		tpl.scope.weight = 70;
		tpl.render();
		expect(ct.childNodes[0].nodeValue).toEqual('john');
		expect(ct.childNodes[1].innerHTML).toEqual('21');
		expect(ct.childNodes[2].nodeValue).toEqual('70');
	});

	it("data-skip true", function () {
		// true is true
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

	it("data-skip true number", function () {
		// 1 is true
		ct.innerHTML = '{{name}}<span data-skip="1">{{age}}</span>{{weight}}';
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
		// false is false
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

	it("data-skip false number", function () {
		// 0 is false
		ct.innerHTML = '{{name}}<span data-skip="0">{{age}}</span>{{weight}}';
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
		// no value is false
		ct.innerHTML = '<div data-show></span>';
		tpl.compile();
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-show')).toBeFalsy();
		else expect(ct.firstChild.getAttribute('data-show')).toEqual('false');
		expect(ct.firstChild.style.display).toEqual('none');
	});

	it("data-show with value", function () {
		// value is true
		ct.innerHTML = '<div data-show="{{myValue}}"></span>';
		tpl.compile();
		tpl.scope.myValue = {};
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-show')).toBeTruthy();
		else expect(ct.firstChild.getAttribute('data-show')).toEqual('true');
		expect(ct.firstChild.style.display).toEqual('');
	});

	it("data-show with null value", function () {
		// null is false
		ct.innerHTML = '<div data-show="{{myValue}}"></span>';
		tpl.compile();
		tpl.scope.myValue = null;
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-show')).toBeFalsy();
		else expect(ct.firstChild.getAttribute('data-show')).toEqual('false');
		expect(ct.firstChild.style.display).toEqual('none');
	});

	it("data-show with undefined value", function () {
		// undefined is false
		ct.innerHTML = '<div data-show="{{myValue}}"></span>';
		tpl.compile();
		tpl.scope.myValue = undefined;
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-show')).toBeFalsy();
		else expect(ct.firstChild.getAttribute('data-show')).toEqual('false');
		expect(ct.firstChild.style.display).toEqual('none');
	});

	it("data-show empty string", function () {
		// empty string is false
		ct.innerHTML = '<div data-show=""></span>';
		tpl.compile();
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-show')).toBeFalsy();
		else expect(ct.firstChild.getAttribute('data-show')).toEqual('false');
		expect(ct.firstChild.style.display).toEqual('none');
	});

	it("data-show true", function () {
		// true is true
		ct.innerHTML = '<div data-show="true"></span>';
		tpl.compile();
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-show')).toBeTruthy();
		else expect(ct.firstChild.getAttribute('data-show')).toEqual('true');
		expect(ct.firstChild.style.display).toEqual('');
	});

	it("data-show true number", function () {
		// 1 is true
		ct.innerHTML = '<div data-show="1"></span>';
		tpl.compile();
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-show')).toBeTruthy();
		else expect(ct.firstChild.getAttribute('data-show')).toEqual('true');
		expect(ct.firstChild.style.display).toEqual('');
	});

	it("data-show false", function () {
		// false is false
		ct.innerHTML = '<div data-show="false"></span>';
		tpl.compile();
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-show')).toBeFalsy();
		else expect(ct.firstChild.getAttribute('data-show')).toEqual('false');
		expect(ct.firstChild.style.display).toEqual('none');
	});

	it("data-show false number", function () {
		// 0 is false
		ct.innerHTML = '<div data-show="0"></span>';
		tpl.compile();
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-show')).toBeFalsy();
		else expect(ct.firstChild.getAttribute('data-show')).toEqual('false');
		expect(ct.firstChild.style.display).toEqual('none');
	});

	it("data-hide no value", function () {
		// no value is false
		ct.innerHTML = '<div data-hide></span>';
		tpl.compile();
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-hide')).toBeFalsy();
		else expect(ct.firstChild.getAttribute('data-hide')).toEqual('false');
		expect(ct.firstChild.style.display).toEqual('');
	});

	it("data-hide with value", function () {
		// value is true
		ct.innerHTML = '<div data-hide="{{myValue}}"></span>';
		tpl.compile();
		tpl.scope.myValue = [];
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-hide')).toBeFalsy();
		else expect(ct.firstChild.getAttribute('data-hide')).toEqual('false');
		expect(ct.firstChild.style.display).toEqual('');
	});

	it("data-hide with null value", function () {
		// null is false
		ct.innerHTML = '<div data-hide="{{myValue}}"></span>';
		tpl.compile();
		tpl.scope.myValue = null;
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-hide')).toBeFalsy();
		else expect(ct.firstChild.getAttribute('data-hide')).toEqual('false');
		expect(ct.firstChild.style.display).toEqual('');
	});

	it("data-hide with undefined value", function () {
		// undefined is false
		ct.innerHTML = '<div data-hide="{{myValue}}"></span>';
		tpl.compile();
		tpl.scope.myValue = undefined;
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-hide')).toBeFalsy();
		else expect(ct.firstChild.getAttribute('data-hide')).toEqual('false');
		expect(ct.firstChild.style.display).toEqual('');
	});

	it("data-hide empty string", function () {
		// empty string is false
		ct.innerHTML = '<div data-hide=""></span>';
		tpl.compile();
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-hide')).toBeFalsy();
		else expect(ct.firstChild.getAttribute('data-hide')).toEqual('false');
		expect(ct.firstChild.style.display).toEqual('');
	});

	it("data-hide true", function () {
		// true is true
		ct.innerHTML = '<div data-hide="true"></span>';
		tpl.compile();
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-hide')).toBeTruthy();
		else expect(ct.firstChild.getAttribute('data-hide')).toEqual('true');
		expect(ct.firstChild.style.display).toEqual('none');
	});

	it("data-hide true number", function () {
		// 1 is true
		ct.innerHTML = '<div data-hide="1"></span>';
		tpl.compile();
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-hide')).toBeTruthy();
		else expect(ct.firstChild.getAttribute('data-hide')).toEqual('true');
		expect(ct.firstChild.style.display).toEqual('none');
	});

	it("data-hide false", function () {
		// false is false
		ct.innerHTML = '<div data-hide="false"></span>';
		tpl.compile();
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-hide')).toBeFalsy();
		else expect(ct.firstChild.getAttribute('data-hide')).toEqual('false');
		expect(ct.firstChild.style.display).toEqual('');
	});

	it("data-hide false number", function () {
		// 0 is false
		ct.innerHTML = '<div data-hide="0"></span>';
		tpl.compile();
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-hide')).toBeFalsy();
		else expect(ct.firstChild.getAttribute('data-hide')).toEqual('false');
		expect(ct.firstChild.style.display).toEqual('');
	});

	it("data-checked no value", function () {
		// no value is false
		ct.innerHTML = '<input type="checkbox" data-checked/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) {
			expect(ct.firstChild.getAttribute('data-checked')).toBeFalsy();
			expect(ct.firstChild.getAttribute('checked')).toBeFalsy();
		}
		else if (ie === 8) {
			expect(ct.firstChild.getAttribute('data-checked')).toEqual('false');
			expect(ct.firstChild.getAttribute('checked')).toEqual('');
		}
		else {
			expect(ct.firstChild.getAttribute('data-checked')).toEqual('false');
			expect(ct.firstChild.getAttribute('checked')).toBeNull();
		}
	});

	it("data-checked with value", function () {
		// value is true
		ct.innerHTML = '<input type="checkbox" data-checked="{{myValue}}"/>';
		tpl.compile();
		tpl.scope.myValue = {};
		tpl.render();
		if (ie === 7) {
			expect(ct.firstChild.getAttribute('data-checked')).toBeTruthy();
			expect(ct.firstChild.getAttribute('checked')).toBeTruthy();
		}
		else {
			expect(ct.firstChild.getAttribute('data-checked')).toEqual('true');
			expect(ct.firstChild.getAttribute('checked')).toEqual('checked');
		}
	});

	it("data-checked with null value", function () {
		// null is false
		ct.innerHTML = '<input type="checkbox" data-checked="{{myValue}}"/>';
		tpl.compile();
		tpl.scope.myValue = null;
		tpl.render();
		if (ie === 7) {
			expect(ct.firstChild.getAttribute('data-checked')).toBeFalsy();
			expect(ct.firstChild.getAttribute('checked')).toBeFalsy();
		}
		else if (ie === 8) {
			expect(ct.firstChild.getAttribute('data-checked')).toEqual('false');
			expect(ct.firstChild.getAttribute('checked')).toEqual('');
		}
		else {
			expect(ct.firstChild.getAttribute('data-checked')).toEqual('false');
			expect(ct.firstChild.getAttribute('checked')).toBeNull();
		}
	});

	it("data-checked with undefined value", function () {
		// undefined is false
		ct.innerHTML = '<input type="checkbox" data-checked="{{myValue}}"/>';
		tpl.compile();
		tpl.scope.myValue = undefined;
		tpl.render();
		if (ie === 7) {
			expect(ct.firstChild.getAttribute('data-checked')).toBeFalsy();
			expect(ct.firstChild.getAttribute('checked')).toBeFalsy();
		}
		else if (ie === 8) {
			expect(ct.firstChild.getAttribute('data-checked')).toEqual('false');
			expect(ct.firstChild.getAttribute('checked')).toEqual('');
		}
		else {
			expect(ct.firstChild.getAttribute('data-checked')).toEqual('false');
			expect(ct.firstChild.getAttribute('checked')).toBeNull();
		}
	});

	it("data-checked empty string", function () {
		// empty string is false
		ct.innerHTML = '<input type="checkbox" data-checked=""/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) {
			expect(ct.firstChild.getAttribute('data-checked')).toBeFalsy();
			expect(ct.firstChild.getAttribute('checked')).toBeFalsy();
		}
		else if (ie === 8) {
			expect(ct.firstChild.getAttribute('data-checked')).toEqual('false');
			expect(ct.firstChild.getAttribute('checked')).toEqual('');
		}
		else {
			expect(ct.firstChild.getAttribute('data-checked')).toEqual('false');
			expect(ct.firstChild.getAttribute('checked')).toBeNull();
		}
	});

	it("data-checked true", function () {
		// true is true
		ct.innerHTML = '<input type="checkbox" data-checked="true"/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) {
			expect(ct.firstChild.getAttribute('data-checked')).toBeTruthy();
			expect(ct.firstChild.getAttribute('checked')).toBeTruthy();
		}
		else {
			expect(ct.firstChild.getAttribute('data-checked')).toEqual('true');
			expect(ct.firstChild.getAttribute('checked')).toEqual('checked');
		}
	});

	it("data-checked true number", function () {
		// 1 is true
		ct.innerHTML = '<input type="checkbox" data-checked="1"/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) {
			expect(ct.firstChild.getAttribute('data-checked')).toBeTruthy();
			expect(ct.firstChild.getAttribute('checked')).toBeTruthy();
		}
		else {
			expect(ct.firstChild.getAttribute('data-checked')).toEqual('true');
			expect(ct.firstChild.getAttribute('checked')).toEqual('checked');
		}
	});

	it("data-checked false", function () {
		// false is false
		ct.innerHTML = '<input type="checkbox" data-checked="false"/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) {
			expect(ct.firstChild.getAttribute('data-checked')).toBeFalsy();
			expect(ct.firstChild.getAttribute('checked')).toBeFalsy();
		}
		else if (ie === 8) {
			expect(ct.firstChild.getAttribute('data-checked')).toEqual('false');
			expect(ct.firstChild.getAttribute('checked')).toEqual('');
		}
		else {
			expect(ct.firstChild.getAttribute('data-checked')).toEqual('false');
			expect(ct.firstChild.getAttribute('checked')).toBeNull();
		}
	});

	it("data-checked false number", function () {
		// 0 is false
		ct.innerHTML = '<input type="checkbox" data-checked="0"/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) {
			expect(ct.firstChild.getAttribute('data-checked')).toBeFalsy();
			expect(ct.firstChild.getAttribute('checked')).toBeFalsy();
		}
		else if (ie === 8) {
			expect(ct.firstChild.getAttribute('data-checked')).toEqual('false');
			expect(ct.firstChild.getAttribute('checked')).toEqual('');
		}
		else {
			expect(ct.firstChild.getAttribute('data-checked')).toEqual('false');
			expect(ct.firstChild.getAttribute('checked')).toBeNull();
		}
	});

	it("data-disabled no value", function () {
		// no value is false
		ct.innerHTML = '<input type="checkbox" data-disabled/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) {
			expect(ct.firstChild.getAttribute('data-disabled')).toBeFalsy();
			expect(ct.firstChild.getAttribute('disabled')).toBeFalsy();
		}
		else if (ie === 8) {
			expect(ct.firstChild.getAttribute('data-disabled')).toEqual('false');
			expect(ct.firstChild.getAttribute('disabled')).toEqual('');
		}
		else {
			expect(ct.firstChild.getAttribute('data-disabled')).toEqual('false');
			expect(ct.firstChild.getAttribute('disabled')).toBeNull();
		}
	});

	it("data-disabled with value", function () {
		// value is true
		ct.innerHTML = '<input type="checkbox" data-disabled="{{myValue}}"/>';
		tpl.compile();
		tpl.scope.myValue = {};
		tpl.render();
		if (ie === 7) {
			expect(ct.firstChild.getAttribute('data-disabled')).toBeTruthy();
			expect(ct.firstChild.getAttribute('disabled')).toBeTruthy();
		}
		else {
			expect(ct.firstChild.getAttribute('data-disabled')).toEqual('true');
			expect(ct.firstChild.getAttribute('disabled')).toEqual('disabled');
		}
	});

	it("data-disabled with null value", function () {
		// null is false
		ct.innerHTML = '<input type="checkbox" data-disabled="{{myValue}}"/>';
		tpl.compile();
		tpl.scope.myValue = null;
		tpl.render();
		if (ie === 7) {
			expect(ct.firstChild.getAttribute('data-disabled')).toBeFalsy();
			expect(ct.firstChild.getAttribute('disabled')).toBeFalsy();
		}
		else if (ie === 8) {
			expect(ct.firstChild.getAttribute('data-disabled')).toEqual('false');
			expect(ct.firstChild.getAttribute('disabled')).toEqual('');
		}
		else {
			expect(ct.firstChild.getAttribute('data-disabled')).toEqual('false');
			expect(ct.firstChild.getAttribute('disabled')).toBeNull();
		}
	});

	it("data-disabled with undefined value", function () {
		// undefined is false
		ct.innerHTML = '<input type="checkbox" data-disabled="{{myValue}}"/>';
		tpl.compile();
		tpl.scope.myValue = undefined;
		tpl.render();
		if (ie === 7) {
			expect(ct.firstChild.getAttribute('data-disabled')).toBeFalsy();
			expect(ct.firstChild.getAttribute('disabled')).toBeFalsy();
		}
		else if (ie === 8) {
			expect(ct.firstChild.getAttribute('data-disabled')).toEqual('false');
			expect(ct.firstChild.getAttribute('disabled')).toEqual('');
		}
		else {
			expect(ct.firstChild.getAttribute('data-disabled')).toEqual('false');
			expect(ct.firstChild.getAttribute('disabled')).toBeNull();
		}
	});

	it("data-disabled empty string", function () {
		// empty string is false
		ct.innerHTML = '<input type="checkbox" data-disabled=""/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) {
			expect(ct.firstChild.getAttribute('data-disabled')).toBeFalsy();
			expect(ct.firstChild.getAttribute('disabled')).toBeFalsy();
		}
		else if (ie === 8) {
			expect(ct.firstChild.getAttribute('data-disabled')).toEqual('false');
			expect(ct.firstChild.getAttribute('disabled')).toEqual('');
		}
		else {
			expect(ct.firstChild.getAttribute('data-disabled')).toEqual('false');
			expect(ct.firstChild.getAttribute('disabled')).toBeNull();
		}
	});

	it("data-disabled true", function () {
		// true is true
		ct.innerHTML = '<input type="checkbox" data-disabled="true"/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) {
			expect(ct.firstChild.getAttribute('data-disabled')).toBeTruthy();
			expect(ct.firstChild.getAttribute('disabled')).toBeTruthy();
		}
		else {
			expect(ct.firstChild.getAttribute('data-disabled')).toEqual('true');
			expect(ct.firstChild.getAttribute('disabled')).toEqual('disabled');
		}
	});

	it("data-disabled true number", function () {
		// true is true
		ct.innerHTML = '<input type="checkbox" data-disabled="1"/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) {
			expect(ct.firstChild.getAttribute('data-disabled')).toBeTruthy();
			expect(ct.firstChild.getAttribute('disabled')).toBeTruthy();
		}
		else {
			expect(ct.firstChild.getAttribute('data-disabled')).toEqual('true');
			expect(ct.firstChild.getAttribute('disabled')).toEqual('disabled');
		}
	});

	it("data-disabled false", function () {
		// false is false
		ct.innerHTML = '<input type="checkbox" data-disabled="false"/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) {
			expect(ct.firstChild.getAttribute('data-disabled')).toBeFalsy();
			expect(ct.firstChild.getAttribute('disabled')).toBeFalsy();
		}
		else if (ie === 8) {
			expect(ct.firstChild.getAttribute('data-disabled')).toEqual('false');
			expect(ct.firstChild.getAttribute('disabled')).toEqual('');
		}
		else {
			expect(ct.firstChild.getAttribute('data-disabled')).toEqual('false');
			expect(ct.firstChild.getAttribute('disabled')).toBeNull();
		}
	});

	it("data-disabled false number", function () {
		// 0 is false
		ct.innerHTML = '<input type="checkbox" data-disabled="0"/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) {
			expect(ct.firstChild.getAttribute('data-disabled')).toBeFalsy();
			expect(ct.firstChild.getAttribute('disabled')).toBeFalsy();
		}
		else if (ie === 8) {
			expect(ct.firstChild.getAttribute('data-disabled')).toEqual('false');
			expect(ct.firstChild.getAttribute('disabled')).toEqual('');
		}
		else {
			expect(ct.firstChild.getAttribute('data-disabled')).toEqual('false');
			expect(ct.firstChild.getAttribute('disabled')).toBeNull();
		}
	});

	it("data-multiple no value", function () {
		// no value is false
		ct.innerHTML = '<input type="checkbox" data-multiple/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-multiple')).toBeFalsy();
		else expect(ct.firstChild.getAttribute('data-multiple')).toEqual('false');
		expect(ct.firstChild.getAttribute('multiple')).toBeNull();
	});

	it("data-multiple with value", function () {
		// value is true
		ct.innerHTML = '<input type="checkbox" data-multiple="{{myValue}}"/>';
		tpl.compile();
		tpl.scope.myValue = {};
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-multiple')).toBeTruthy();
		else expect(ct.firstChild.getAttribute('data-multiple')).toEqual('true');
		expect(ct.firstChild.getAttribute('multiple')).toEqual('multiple');
	});

	it("data-multiple with null value", function () {
		// null is false
		ct.innerHTML = '<input type="checkbox" data-multiple="{{myValue}}"/>';
		tpl.compile();
		tpl.scope.myValue = null;
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-multiple')).toBeFalsy();
		else expect(ct.firstChild.getAttribute('data-multiple')).toEqual('false');
		expect(ct.firstChild.getAttribute('multiple')).toBeNull();
	});

	it("data-multiple with undefined value", function () {
		// undefined is false
		ct.innerHTML = '<input type="checkbox" data-multiple="{{myValue}}"/>';
		tpl.compile();
		tpl.scope.myValue = undefined;
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-multiple')).toBeFalsy();
		else expect(ct.firstChild.getAttribute('data-multiple')).toEqual('false');
		expect(ct.firstChild.getAttribute('multiple')).toBeNull();
	});

	it("data-multiple empty string", function () {
		// empty string is false
		ct.innerHTML = '<input type="checkbox" data-multiple=""/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-multiple')).toBeFalsy();
		else expect(ct.firstChild.getAttribute('data-multiple')).toEqual('false');
		expect(ct.firstChild.getAttribute('multiple')).toBeNull();
	});

	it("data-multiple true", function () {
		// true is true
		ct.innerHTML = '<input type="checkbox" data-multiple="true"/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-multiple')).toBeTruthy();
		else expect(ct.firstChild.getAttribute('data-multiple')).toEqual('true');
		expect(ct.firstChild.getAttribute('multiple')).toEqual('multiple');
	});

	it("data-multiple true number", function () {
		// 1 is true
		ct.innerHTML = '<input type="checkbox" data-multiple="1"/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-multiple')).toBeTruthy();
		else expect(ct.firstChild.getAttribute('data-multiple')).toEqual('true');
		expect(ct.firstChild.getAttribute('multiple')).toEqual('multiple');
	});

	it("data-multiple false", function () {
		// false is false
		ct.innerHTML = '<input type="checkbox" data-multiple="false"/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-multiple')).toBeFalsy();
		else expect(ct.firstChild.getAttribute('data-multiple')).toEqual('false');
		expect(ct.firstChild.getAttribute('multiple')).toBeNull();
	});

	it("data-multiple false number", function () {
		// 0 is false
		ct.innerHTML = '<input type="checkbox" data-multiple="0"/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-multiple')).toBeFalsy();
		else expect(ct.firstChild.getAttribute('data-multiple')).toEqual('false');
		expect(ct.firstChild.getAttribute('multiple')).toBeNull();
	});

	it("data-readonly no value", function () {
		// no value is false
		ct.innerHTML = '<input type="checkbox" data-readonly/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) {
			expect(ct.firstChild.getAttribute('data-readonly')).toBeFalsy();
			expect(ct.firstChild.getAttribute('readonly')).toBeFalsy();
		}
		else if (ie === 8) {
			expect(ct.firstChild.getAttribute('data-readonly')).toEqual('false');
			expect(ct.firstChild.getAttribute('readonly')).toEqual('');
		}
		else {
			expect(ct.firstChild.getAttribute('data-readonly')).toEqual('false');
			expect(ct.firstChild.getAttribute('readonly')).toBeNull();
		}
	});

	it("data-readonly with value", function () {
		// value is true
		ct.innerHTML = '<input type="checkbox" data-readonly="{{myValue}}"/>';
		tpl.compile();
		tpl.scope.myValue = {};
		tpl.render();
		if (ct.canHaveChildren) {
			// IE
			expect(ct.firstChild.getAttribute('data-readonly')).toBeTruthy();
			expect(ct.firstChild.getAttribute('readonly')).toBeTruthy();
		}
		else {
			expect(ct.firstChild.getAttribute('data-readonly')).toEqual('true');
			expect(ct.firstChild.getAttribute('readonly')).toEqual('readonly');
		}
	});

	it("data-readonly with null value", function () {
		// null is false
		ct.innerHTML = '<input type="checkbox" data-readonly="{{myValue}}"/>';
		tpl.compile();
		tpl.scope.myValue = null;
		tpl.render();
		if (ie === 7) {
			expect(ct.firstChild.getAttribute('data-readonly')).toBeFalsy();
			expect(ct.firstChild.getAttribute('readonly')).toBeFalsy();
		}
		else if (ie === 8) {
			expect(ct.firstChild.getAttribute('data-readonly')).toEqual('false');
			expect(ct.firstChild.getAttribute('readonly')).toEqual('');
		}
		else {
			expect(ct.firstChild.getAttribute('data-readonly')).toEqual('false');
			expect(ct.firstChild.getAttribute('readonly')).toBeNull();
		}
	});

	it("data-readonly with undefined value", function () {
		// undefined is false
		ct.innerHTML = '<input type="checkbox" data-readonly="{{myValue}}"/>';
		tpl.compile();
		tpl.scope.myValue = undefined;
		tpl.render();
		if (ie === 7) {
			expect(ct.firstChild.getAttribute('data-readonly')).toBeFalsy();
			expect(ct.firstChild.getAttribute('readonly')).toBeFalsy();
		}
		else if (ie === 8) {
			expect(ct.firstChild.getAttribute('data-readonly')).toEqual('false');
			expect(ct.firstChild.getAttribute('readonly')).toEqual('');
		}
		else {
			expect(ct.firstChild.getAttribute('data-readonly')).toEqual('false');
			expect(ct.firstChild.getAttribute('readonly')).toBeNull();
		}
	});

	it("data-readonly empty string", function () {
		// empty string is false
		ct.innerHTML = '<input type="checkbox" data-readonly=""/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) {
			expect(ct.firstChild.getAttribute('data-readonly')).toBeFalsy();
			expect(ct.firstChild.getAttribute('readonly')).toBeFalsy();
		}
		else if (ie === 8) {
			expect(ct.firstChild.getAttribute('data-readonly')).toEqual('false');
			expect(ct.firstChild.getAttribute('readonly')).toEqual('');
		}
		else {
			expect(ct.firstChild.getAttribute('data-readonly')).toEqual('false');
			expect(ct.firstChild.getAttribute('readonly')).toBeNull();
		}
	});

	it("data-readonly true", function () {
		// true is true
		ct.innerHTML = '<input type="checkbox" data-readonly="true"/>';
		tpl.compile();
		tpl.render();
		if (ct.canHaveChildren) {
			// IE
			expect(ct.firstChild.getAttribute('data-readonly')).toBeTruthy();
			expect(ct.firstChild.getAttribute('readonly')).toBeTruthy();
		}
		else {
			expect(ct.firstChild.getAttribute('data-readonly')).toEqual('true');
			expect(ct.firstChild.getAttribute('readonly')).toEqual('readonly');
		}
	});

	it("data-readonly true number", function () {
		// 1 is true
		ct.innerHTML = '<input type="checkbox" data-readonly="1"/>';
		tpl.compile();
		tpl.render();
		if (ct.canHaveChildren) {
			// IE
			expect(ct.firstChild.getAttribute('data-readonly')).toBeTruthy();
			expect(ct.firstChild.getAttribute('readonly')).toBeTruthy();
		}
		else {
			expect(ct.firstChild.getAttribute('data-readonly')).toEqual('true');
			expect(ct.firstChild.getAttribute('readonly')).toEqual('readonly');
		}
	});

	it("data-readonly false", function () {
		// false is false
		ct.innerHTML = '<input type="checkbox" data-readonly="false"/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) {
			expect(ct.firstChild.getAttribute('data-readonly')).toBeFalsy();
			expect(ct.firstChild.getAttribute('readonly')).toBeFalsy();
		}
		else if (ie === 8) {
			expect(ct.firstChild.getAttribute('data-readonly')).toEqual('false');
			expect(ct.firstChild.getAttribute('readonly')).toEqual('');
		}
		else {
			expect(ct.firstChild.getAttribute('data-readonly')).toEqual('false');
			expect(ct.firstChild.getAttribute('readonly')).toBeNull();
		}
	});

	it("data-readonly false number", function () {
		// 0 is false
		ct.innerHTML = '<input type="checkbox" data-readonly="0"/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) {
			expect(ct.firstChild.getAttribute('data-readonly')).toBeFalsy();
			expect(ct.firstChild.getAttribute('readonly')).toBeFalsy();
		}
		else if (ie === 8) {
			expect(ct.firstChild.getAttribute('data-readonly')).toEqual('false');
			expect(ct.firstChild.getAttribute('readonly')).toEqual('');
		}
		else {
			expect(ct.firstChild.getAttribute('data-readonly')).toEqual('false');
			expect(ct.firstChild.getAttribute('readonly')).toBeNull();
		}
	});

	it("data-selected no value", function () {
		// no value is false
		ct.innerHTML = '<input type="checkbox" data-selected/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-selected')).toBeFalsy();
		else expect(ct.firstChild.getAttribute('data-selected')).toEqual('false');
		expect(ct.firstChild.getAttribute('selected')).toBeNull();
	});

	it("data-selected with value", function () {
		// value is true
		ct.innerHTML = '<input type="checkbox" data-selected="{{myValue}}"/>';
		tpl.compile();
		tpl.scope.myValue = {};
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-selected')).toBeTruthy();
		else expect(ct.firstChild.getAttribute('data-selected')).toEqual('true');
		expect(ct.firstChild.getAttribute('selected')).toEqual('selected');
	});

	it("data-selected with null value", function () {
		// null is false
		ct.innerHTML = '<input type="checkbox" data-selected="{{myValue}}"/>';
		tpl.compile();
		tpl.scope.myValue = null;
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-selected')).toBeFalsy();
		else expect(ct.firstChild.getAttribute('data-selected')).toEqual('false');
		expect(ct.firstChild.getAttribute('selected')).toBeNull();
	});

	it("data-selected with undefined value", function () {
		// undefined is false
		ct.innerHTML = '<input type="checkbox" data-selected="{{myValue}}"/>';
		tpl.compile();
		tpl.scope.myValue = undefined;
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-selected')).toBeFalsy();
		else expect(ct.firstChild.getAttribute('data-selected')).toEqual('false');
		expect(ct.firstChild.getAttribute('selected')).toBeNull();
	});

	it("data-selected empty string", function () {
		// empty string is false
		ct.innerHTML = '<input type="checkbox" data-selected/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-selected')).toBeFalsy();
		else expect(ct.firstChild.getAttribute('data-selected')).toEqual('false');
		expect(ct.firstChild.getAttribute('selected')).toBeNull();
	});

	it("data-selected true", function () {
		// true is true
		ct.innerHTML = '<input type="checkbox" data-selected="true"/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-selected')).toBeTruthy();
		else expect(ct.firstChild.getAttribute('data-selected')).toEqual('true');
		expect(ct.firstChild.getAttribute('selected')).toEqual('selected');
	});

	it("data-selected true number", function () {
		// 1 is true
		ct.innerHTML = '<input type="checkbox" data-selected="1"/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-selected')).toBeTruthy();
		else expect(ct.firstChild.getAttribute('data-selected')).toEqual('true');
		expect(ct.firstChild.getAttribute('selected')).toEqual('selected');
	});

	it("data-selected false", function () {
		// false is false
		ct.innerHTML = '<input type="checkbox" data-selected="false"/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-selected')).toBeFalsy();
		else expect(ct.firstChild.getAttribute('data-selected')).toEqual('false');
		expect(ct.firstChild.getAttribute('selected')).toBeNull();
	});

	it("data-selected false number", function () {
		// 0 is false
		ct.innerHTML = '<input type="checkbox" data-selected="0"/>';
		tpl.compile();
		tpl.render();
		if (ie === 7) expect(ct.firstChild.getAttribute('data-selected')).toBeFalsy();
		else expect(ct.firstChild.getAttribute('data-selected')).toEqual('false');
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

	it("data-html no value", function () {
		// no value is false
		ct.innerHTML = "<p data-html>{{myHtml}}</p>";
		tpl.compile();
		tpl.scope.myHtml = 'first<br>second';
		tpl.render();
		expect(ct.firstChild.innerHTML.toLowerCase()).toEqual('first&lt;br&gt;second');
	});

	it("data-html empty string", function () {
		// empty string is false
		ct.innerHTML = '<p data-html="">{{myHtml}}</p>';
		tpl.compile();
		tpl.scope.myHtml = 'first<br>second';
		tpl.render();
		expect(ct.firstChild.innerHTML.toLowerCase()).toEqual('first&lt;br&gt;second');
	});

	it("data-html true", function () {
		// true is true
		ct.innerHTML = '<p data-html="true">{{myHtml}}</p>';
		tpl.compile();
		tpl.scope.myHtml = 'first<br>second';
		tpl.render();
		expect(ct.firstChild.innerHTML.toLowerCase()).toEqual('first<br>second');
	});

	it("data-html true number", function () {
		// 1 is true
		ct.innerHTML = '<p data-html="1">{{myHtml}}</p>';
		tpl.compile();
		tpl.scope.myHtml = 'first<br>second';
		tpl.render();
		expect(ct.firstChild.innerHTML.toLowerCase()).toEqual('first<br>second');
	});

	it("data-html false", function () {
		// false is false
		ct.innerHTML = '<p data-html="false">{{myHtml}}</p>';
		tpl.compile();
		tpl.scope.myHtml = 'first<br>second';
		tpl.render();
		expect(ct.firstChild.innerHTML.toLowerCase()).toEqual('first&lt;br&gt;second');
	});

	it("data-html false number", function () {
		// 0 is false
		ct.innerHTML = '<p data-html="0">{{myHtml}}</p>';
		tpl.compile();
		tpl.scope.myHtml = 'first<br>second';
		tpl.render();
		expect(ct.firstChild.innerHTML.toLowerCase()).toEqual('first&lt;br&gt;second');
	});

	it("data-html with data-repeat", function () {
		ct.innerHTML = '<div data-repeat="item in items" data-html="true">{{item}}</div>';
		tpl.compile();
		tpl.scope.items = [
			'first<br>one',
			'<span>second<br>two</span>',
			'third<br>three'
		];
		tpl.render();
		expect(ct.childNodes[0].innerHTML.toLowerCase()).toEqual(tpl.scope.items[0]);
		expect(ct.childNodes[1].innerHTML.toLowerCase()).toEqual(tpl.scope.items[1]);
		expect(ct.childNodes[2].innerHTML.toLowerCase()).toEqual(tpl.scope.items[2]);
	});

	it("data-html with data-repeat deep", function () {
		ct.innerHTML = '<div data-repeat="item in items"><p data-html="true">{{item}}</p></div>';
		tpl.compile();
		tpl.scope.items = [
			'first<br>one',
			'<span>second<br>two</span>',
			'third<br>three'
		];
		tpl.render();
		expect(ct.childNodes[0].firstChild.innerHTML.toLowerCase()).toEqual(tpl.scope.items[0]);
		expect(ct.childNodes[1].firstChild.innerHTML.toLowerCase()).toEqual(tpl.scope.items[1]);
		expect(ct.childNodes[2].firstChild.innerHTML.toLowerCase()).toEqual(tpl.scope.items[2]);
	});



});
