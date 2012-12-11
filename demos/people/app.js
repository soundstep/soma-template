var template = soma.template.create(document.getElementById('people'));
var people = template.scope.people = JSON.parse( localStorage.getItem('soma-template-people') || '[]' );
template.render();

template.scope.add = function(event) {
	if (event.keyCode && event.keyCode !== 13) {
		return;
	}
	people.push({
		name: document.getElementById('personName').value,
		age: document.getElementById('personAge').value
	});
	template.render();
	save();
}
template.scope.remove = function(person) {
	people.splice(people.indexOf(person), 1);
	template.render();
	save();
}
template.scope.removeAll = function() {
	people = template.scope.people = [];
	template.render();
	save();
}

function save() {
	localStorage.setItem('soma-template-people', JSON.stringify(people));
}
