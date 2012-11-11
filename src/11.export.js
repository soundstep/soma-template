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
		console.log(getTemplate(element));
	}
	// create template
	var template = new Template(element);
	templates.put(element, template);
	return template;
}

function getTemplate(element) {
	if (!isElement(element)) return null;
	return templates.get(element);
}

function renderAllTemplates() {
	for (var key in templates.getData()) {
		templates.get(key).render();
	}
}

// set regex
tokens.start(tokenStart);
tokens.end(tokenEnd);

// exports
soma.template.create = createTemplate;
soma.template.get = getTemplate;
soma.template.renderAll = renderAllTemplates;

// register for AMD module
if (typeof define === 'function' && define.amd) {
	define("soma-template", soma.template);
}

// export for node.js
if (typeof exports !== 'undefined') {
	if (typeof module !== 'undefined' && module.exports) {
		exports = module.exports = soma.template;
	}
	exports = soma.template;
}
