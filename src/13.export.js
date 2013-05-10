	function createTemplate(source, target) {
		var element;
		if (isString(source)) {
			// string template
			if (!isElement(target)) {
				throw new Error(soma.template.errors.TEMPLATE_STRING_NO_ELEMENT);
			}
			target.innerHTML = source;
			element = target;
		}
		else if (isElement(source)) {
			if (isElement(target)) {
				// element template with target
				target.innerHTML = source.innerHTML;
				element = target;
			}
			else {
				// element template
				element = source;
			}
		}
		else {
			throw new Error(soma.template.errors.TEMPLATE_NO_PARAM);
		}
		// existing template
		if (getTemplate(element)) {
			getTemplate(element).dispose();
			templates.remove(element);
		}
		// create template
		var template = new Template(element);
		templates.put(element, template);
		return template;
	}

	function getTemplate(element) {
		return templates.get(element);
	}

	function renderAllTemplates() {
		var data = templates.getData();
		for (var key in templates.getData()) {
			if (data.hasOwnProperty(key)) {
				templates.get(key).render();
			}
		}
	}

	function appendHelpers(obj) {
		if (obj === null) {
			helpersObject = {};
			helpersScopeObject = {};
		}
		if (isDefined(obj) && isObject(obj)) {
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					helpersObject[key] = helpersScopeObject[key] = obj[key];
				}
			}
		}
		return helpersObject;
	}

	// set regex
	tokens.start(tokenStart);
	tokens.end(tokenEnd);

	// plugins

	soma.plugins = soma.plugins || {};

	var TemplatePlugin = function(instance, injector) {
		instance.constructor.prototype.createTemplate = function(cl, domElement) {
			if (!cl || typeof cl !== 'function') {
				throw new Error('Error creating a template, the first parameter must be a function.');
			}
			if (domElement && isElement(domElement)) {
				var template = soma.template.create(domElement);
				for (var key in template) {
					if (typeof template[key] === 'function') {
						cl.prototype[key] = template[key].bind(template);
					}
				}
				cl.prototype.render = template.render.bind(template);
				var childInjector = injector.createChild();
				childInjector.mapValue('template', template);
				childInjector.mapValue('scope', template.scope);
				childInjector.mapValue('element', template.element);
				return childInjector.createInstance(cl);
			}
			return null;
		};
		soma.template.bootstrap = function(attrValue, element, func) {
			instance.createTemplate(func, element);
		};
	};
	if (soma.plugins && soma.plugins.add) {
		soma.plugins.add(TemplatePlugin);
	}

	soma.template.Plugin = TemplatePlugin;

	// exports
	soma.template.create = createTemplate;
	soma.template.get = getTemplate;
	soma.template.renderAll = renderAllTemplates;
	soma.template.helpers = appendHelpers;
	soma.template.bootstrap = bootstrapTemplate;
	soma.template.addEvent = addEvent;
	soma.template.removeEvent = removeEvent;
	soma.template.parseEvents = parseEvents;
	soma.template.clearEvents = clearEvents;
	soma.template.ready = ready;

	// register for AMD module
	/* globals define:false */
	if (typeof define === 'function' && typeof define.amd !== 'undefined') {
		define('soma-template', soma);
	}

	// export for node.js
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = soma;
	}
	else {
		window.soma = soma;
	}
