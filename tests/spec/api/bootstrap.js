var divBootstrap = doc.createElement('div');

divBootstrap.innerHTML += '<div id="tpl-bootstrap" data-template="TemplateBootstrap" style="display: none">{{name}}</div>';
divBootstrap.innerHTML += '<div id="tpl-bootstrap-package" data-template="path.namespace.TemplateBootstrap" style="display: none">{{name}}</div>';
divBootstrap.innerHTML += '<div id="tpl-bootstrap-error" data-template="TemplateError" style="display: none">{{name}}</div>';
doc.body.appendChild(divBootstrap);

var TemplateBootstrap = function(template, scope, element) {
	scope.name = 'john';
	template.render();
}
var path = {
	namespace: {
		TemplateBootstrap: function(template, scope, element) {
			scope.name = 'david';
			template.render();
		}
	}
}

describe("api - bootstrap", function () {

	beforeEach(function () {
		createContainer();
		createTemplate();
	});

	afterEach(function () {
		disposeTemplate();
		disposeContainer();
	});

	it("template created", function () {
		soma.template.ready(function() {
			var content = document.getElementById('tpl-bootstrap');
			var template = soma.template.get(content);
			expect(template).toBeDefined();
			expect(content.innerHTML).toEqual('john');
			template.dispose();
			template = null;
		});
	});

	it("template package created", function () {
		soma.template.ready(function() {
			var content = document.getElementById('tpl-bootstrap-package');
			var template = soma.template.get(content);
			expect(template).toBeDefined();
			expect(content.innerHTML).toEqual('david');
			template.dispose();
			template = null;
		});
	});

	it("template package error", function () {
		soma.template.ready(function() {
			var content = document.getElementById('tpl-bootstrap-error');
			var template = soma.template.get(content);
			expect(template).toBeUndefined();
		});
	});

});
