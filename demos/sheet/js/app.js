;(function(ns, undefined) {

    var Application = soma.Application.extend({
	    init: function() {
		    this.injector.mapClass('dataset', ns.DataSet, true);
		    var containers = this.mediators.create(ContainerMediator, $('.container'));
		    this.injector.mapValue('containers', containers);
		    this.mediators.create(MainMediator, $('.main'));
	    }
    });

	var MainMediator = function(scope, containers) {

		$('.buttons', scope).append('<button class="btn btn-small render"></i>render all</button><button class="btn btn-small data hidden"><i class="icon-random"></i>change data</button><button class="btn btn-small reset hidden"><i class="icon-remove"></i>reset all</button>');

		var renderButton = $('.render', scope);
		var dataButton = $('.data', scope);
		var resetButton = $('.reset', scope);

		renderButton.click(function() {
			var i = -1, l = containers.length;
			while (++i < l) {
				containers[i].render();
			}
			// buttons
			renderButton.hide();
			dataButton.show();
			resetButton.show();
		});

		resetButton.click(function() {
			var i = -1, l = containers.length;
			while (++i < l) {
				containers[i].reset();
			}
			// buttons
			renderButton.show();
			dataButton.hide();
			resetButton.hide();
		});

		dataButton.click(function() {
			var i = -1, l = containers.length;
			while (++i < l) {
				containers[i].change();
			}
		});
	};

	var ContainerMediator = function(scope, dataset) {

		$('.buttons', scope).append('<button class="btn btn-small render"></i>render</button><button class="btn btn-small data hidden"><i class="icon-random"></i>change data</button><button class="btn btn-small reset hidden"><i class="icon-remove"></i>reset</button>');

		var id = $(scope).attr('data-id');
		var tpl = $('.tpl', scope);
		var tplCache = tpl.html();
		var tplOuter = tpl[0].outerHTML.replace(' class="tpl"', '');
		var tplOuterPrint = getHtmlString(tplOuter);
		var tplPrint = $('.tpl-print', scope);
		var dataPrint = $('.data-print', scope);
		var renderButton = $('.render', scope);
		var dataButton = $('.data', scope);
		var resetButton = $('.reset', scope);
		var template = soma.template.create(tpl[0]);

		var count = 0;
		tplPrint.html(tplOuterPrint);
		// print default data
		var data = dataset.getData(id, 0);
		template.update(data);
		dataPrint.html(stringify(data));

		renderButton.click(function() {
			this.render();
		}.bind(this));

		resetButton.click(function() {
			this.reset();
		}.bind(this));

		dataButton.click(function() {
			this.change();
		}.bind(this));

		this.render = function() {
			var data = dataset.getData(id, count);
			template.render(data);
			// data print
			dataPrint.html(stringify(data));
			dataPrint.show();
			// button
			renderButton.hide();
			dataButton.show();
			resetButton.show();
		};

		this.reset = function() {
			count = 0;
			tpl.html(tplCache);
			template.compile();
			// buttons
			renderButton.show();
			dataButton.hide();
			resetButton.hide();
		};

		this.change = function() {
			var data = dataset.getData(id, ++count % 2);
			// data print
			dataPrint.html(stringify(data));
			template.render(data);
		};

	};

	function stringify(data) {
		if (!data) return "";
		return JSON.stringify(data, jsonFilter, 2).replace(/(})"(?=,|\s)|"(?=func)|(})"(?=\s)/gm, '$1');
	}

	function getHtmlString(value) {
		var regAngles = /(<)([^>]+)(>)/gm;
		var regTokens = /(\{\{.+?\}\})/g
		value = value.replace(regAngles, '&lt;$2&gt;');
		value = value.replace(regTokens, '<span class="text-info">$1</span>')
		return value;
	}

	function jsonFilter(key, value) {
		if (typeof value === 'function') {
			value = value.toString();
			value = value.replace(/\n/gm, '<br\>');
			value = value.replace(/\t/gm, ' ');
		}
		return value;
	}

	var app = new Application();

})(this['ns'] = this['ns'] || {});
