function createTemplate(element) {
	if (!isElement(element)) return;
	var existingTemplate = getTemplate(element);
	if (existingTemplate) {
		existingTemplate.dispose();
		existingTemplate = null;
	}
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

// exports
soma.template.create = createTemplate;
soma.template.get = getTemplate;
soma.template.renderAll = renderAllTemplates;
