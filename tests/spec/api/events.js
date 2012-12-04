function clickHandler(event) {
	alert('click')
}

describe("api - events", function () {

	beforeEach(function () {
		createContainer();
		createTemplate();
	});

	afterEach(function () {
		disposeTemplate();
		disposeContainer();
	});

	it("call function", function () {
		ct.innerHTML = '<button id="btClick" data-click="clickHandler()">click</button>';
		tpl.compile();
		tpl.scope.clickHandler = function(){};
		tpl.render();
		spyOn(tpl.scope, 'clickHandler');
		document.getElementById('btClick').click();
		expect(tpl.scope.clickHandler).toHaveBeenCalled();
	});

	it("call function with param", function () {
		var resultCall;
		ct.innerHTML = '<button id="btClick" data-click="clickHandler(name)">click</button>';
		tpl.compile();
		tpl.scope.name = 'john';
		tpl.scope.clickHandler = function(event, name){ return name; };
		tpl.render();
		spyOn(tpl.scope, 'clickHandler');
		document.getElementById('btClick').click();
		expect(tpl.scope.clickHandler).toHaveBeenCalled();
		expect(resultCall).toEqual('john')
	});

});
