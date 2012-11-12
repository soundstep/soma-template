var doc = document;
var body = document.getElementsByTagName("body")[0];
var ct = null;
var tpl;

function createContainer() {
	ct = doc.createElement('div');
	ct.setAttribute('id', 'ct');
	body.appendChild(ct);
}

function disposeContainer() {
	body.removeChild(ct);
	ct = null;
}

function createTemplate() {
	tpl = soma.template.create(ct);
}

function disposeTemplate() {
	tpl.dispose();
	tpl = null;
}

function createTemplateWithContent(content) {
	var div = doc.createElement('div');
	div.innerHTML = content;
	return soma.template.create(div);
}
