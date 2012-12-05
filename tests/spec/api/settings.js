describe("api - settings", function () {

	var settings;

	beforeEach(function () {
		createContainer();
		createTemplate();
		settings = soma.template.settings;
	});

	afterEach(function () {
		disposeTemplate();
		disposeContainer();
	});

	it("settings value", function () {
		expect(settings).toBeDefined();
		expect(settings).toEqual(jasmine.any(Object));
	});

	it("tokens values", function () {
		expect(settings.tokens).toBeDefined();
		expect(settings.tokens).toEqual(jasmine.any(Object));
		expect(settings.tokens.start()).toEqual('\\{\\{');
		expect(settings.tokens.end()).toEqual('\\}\\}');
	});

	it("attributes values", function () {
		expect(settings.attributes).toBeDefined();
		expect(settings.attributes).toEqual(jasmine.any(Object));
		expect(settings.attributes.skip).toEqual('data-skip');
		expect(settings.attributes.repeat).toEqual('data-repeat');
		expect(settings.attributes.src).toEqual('data-src');
		expect(settings.attributes.href).toEqual('data-href');
		expect(settings.attributes.show).toEqual('data-show');
		expect(settings.attributes.hide).toEqual('data-hide');
		expect(settings.attributes.cloak).toEqual('data-cloak');
		expect(settings.attributes.checked).toEqual('data-checked');
		expect(settings.attributes.disabled).toEqual('data-disabled');
		expect(settings.attributes.multiple).toEqual('data-multiple');
		expect(settings.attributes.readonly).toEqual('data-readonly');
		expect(settings.attributes.selected).toEqual('data-selected');
		expect(settings.attributes.template).toEqual('data-template');
	});

	it("attributes vars", function () {
		expect(settings.vars).toBeDefined();
		expect(settings.vars).toEqual(jasmine.any(Object));
		expect(settings.vars.index).toEqual('$index');
		expect(settings.vars.key).toEqual('$key');
	});

	it("attributes events", function () {
		expect(settings.events).toBeDefined();
		expect(settings.events['data-click']).toEqual('click');
		expect(settings.events['data-mouseover']).toEqual('mouseover');
	});

	it("autocreate", function () {
		expect(settings.autocreate).toBeTruthy();
	});

	it("change token start", function () {
		settings.tokens.start('[-(');
		expect(settings.tokens.start()).toEqual('\\[\\-\\(');
		var t1 = createTemplateWithContent('[-(name}}');
		t1.scope.name = "john";
		t1.render();
		expect(t1.element.innerHTML).toEqual('john');
		settings.tokens.start('{{');
	});

	it("change token end", function () {
		settings.tokens.end(']');
		expect(settings.tokens.end()).toEqual('\\]');
		var t1 = createTemplateWithContent('{{name]');
		t1.scope.name = "john";
		t1.render();
		expect(t1.element.innerHTML).toEqual('john');
		settings.tokens.end('}}');
	});

	it("change skip", function () {
		settings.attributes.skip = 'custom-skip';
		var t1 = createTemplateWithContent('<span custom-skip>{{name}}</span>');
		t1.scope.name = 'john';
		t1.render();
		expect(t1.element.firstChild.innerHTML).toEqual('{{name}}');
		settings.attributes.skip = 'data-skip';
	});

	it("change src", function () {
		settings.attributes.src = 'custom-src';
		var t1 = createTemplateWithContent('<span custom-src="{{name}}"></span>');
		t1.scope.name = 'john';
		t1.render();
		expect(t1.element.firstChild.getAttribute('src')).toEqual('john');
		settings.attributes.src = 'data-src';
	});

	it("change href", function () {
		settings.attributes.href = 'custom-href';
		var t1 = createTemplateWithContent('<span custom-href="{{name}}"></span>');
		t1.scope.name = 'soundstep.com';
		t1.render();
		expect(t1.element.firstChild.getAttribute('href')).toEqual('soundstep.com');
		settings.attributes.href = 'data-href';
	});

	it("change show", function () {
		settings.attributes.show = 'custom-show';
		var t1 = createTemplateWithContent('<span custom-show="true"></span>');
		t1.render();
		expect(t1.element.firstChild.style.display).toEqual('block');
		settings.attributes.show = 'data-show';
	});

	it("change hide", function () {
		settings.attributes.hide = 'custom-hide';
		var t1 = createTemplateWithContent('<span custom-hide="true"></span>');
		t1.render();
		expect(t1.element.firstChild.style.display).toEqual('none');
		settings.attributes.hide = 'data-hide';
	});

	it("change cloak", function () {
		settings.attributes.cloak = 'custom-cloak';
		var t1 = createTemplateWithContent('<span class="custom-cloak"></span>');
		t1.render();
		expect(t1.element.firstChild.getAttribute('class')).not.toEqual('custom-cloak');
		settings.attributes.cloak = 'data-cloak';
	});

	it("change checked", function () {
		settings.attributes.checked = 'custom-checked';
		var t1 = createTemplateWithContent('<input custom-checked>');
		t1.render();
		if (ct.canHaveChildren) {
			expect(t1.element.firstChild.getAttribute('checked')).toBeTruthy();
		}
		else {
			expect(t1.element.firstChild.getAttribute('checked')).toEqual('checked');
		}
		settings.attributes.checked = 'data-checked';
	});

	it("change disabled", function () {
		settings.attributes.disabled = 'custom-disabled';
		var t1 = createTemplateWithContent('<span custom-disabled></span>');
		t1.render();
		if (ct.canHaveChildren) {
			expect(t1.element.firstChild.getAttribute('disabled')).toBeTruthy();
		}
		else {
			expect(t1.element.firstChild.getAttribute('disabled')).toEqual('disabled');
		}
		settings.attributes.disabled = 'data-disabled';
	});

	it("change multiple", function () {
		settings.attributes.multiple = 'custom-multiple';
		var t1 = createTemplateWithContent('<span custom-multiple></span>');
		t1.render();
		expect(t1.element.firstChild.getAttribute('multiple')).toEqual('multiple');
		settings.attributes.multiple = 'data-multiple';
	});

	it("change readonly", function () {
		settings.attributes.readonly = 'custom-readonly';
		var t1 = createTemplateWithContent('<span custom-readonly></span>');
		t1.render();
		if (ct.canHaveChildren) {
			expect(t1.element.firstChild.getAttribute('readonly')).toBeTruthy();
		}
		else {
			expect(t1.element.firstChild.getAttribute('readonly')).toEqual('readonly');
		}
		settings.attributes.readonly = 'data-readonly';
	});

	it("change selected", function () {
		settings.attributes.selected = 'custom-selected';
		var t1 = createTemplateWithContent('<span custom-selected></span>');
		t1.render();
		expect(t1.element.firstChild.getAttribute('selected')).toEqual('selected');
		settings.attributes.selected = 'data-selected';
	});

	it("change repeat", function () {
		settings.attributes.repeat = 'custom-repeat';
		var t1 = createTemplateWithContent('<span custom-repeat="item in items"></span>');
		t1.scope.items = [1, 2, 3];
		t1.render();
		expect(t1.element.childNodes.length).toEqual(3);
		settings.attributes.repeat = 'data-repeat';
	});

	it("change template", function () {
		//settings.attributes.template = 'custom-template';

	});

	it("change event", function () {
		soma.template.settings.events['custom-click'] = 'click';
		ct.innerHTML = '<button id="bt1" custom-click="clickHandler()">click</button>';
		tpl.compile();
		tpl.render();
		tpl.scope.clickHandler = function(){};
		spyOn(tpl.scope, 'clickHandler');
		simulate(document.getElementById('bt1'), 'click');
		expect(tpl.scope.clickHandler).toHaveBeenCalled();
		expect(tpl.scope.clickHandler.mostRecentCall.args[0].type).toEqual('click');
	});

	it("change index", function () {
		settings.vars.index = 'new-index';
		var t1 = createTemplateWithContent('<span data-repeat="item in items">{{new-index}}</span>');
		t1.scope.items = [1, 2, 3];
		t1.render();
		expect(t1.element.childNodes[0].firstChild.nodeValue).toEqual('0');
		expect(t1.element.childNodes[1].firstChild.nodeValue).toEqual('1');
		expect(t1.element.childNodes[2].firstChild.nodeValue).toEqual('2');
		settings.vars.index = '$index';
	});

	it("change key", function () {
		settings.vars.key = 'new-key';
		var t1 = createTemplateWithContent('<span data-repeat="item in items">{{new-key}}</span>');
		t1.scope.items = {item1:1, item2:2, item3:3};
		t1.render();
		expect(t1.element.childNodes[0].firstChild.nodeValue).toEqual('item1');
		expect(t1.element.childNodes[1].firstChild.nodeValue).toEqual('item2');
		expect(t1.element.childNodes[2].firstChild.nodeValue).toEqual('item3');
		settings.vars.key = '$key';
	});

});
