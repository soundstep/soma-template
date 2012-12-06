var todo = window.todo || {};

(function( window ) {
	'use strict';


	var ENTER_KEY = 13,
		STORE_KEY = 'todo-soma-template';

	var c = 0;

	todo.Template2 = function( template, scope ) {
		var c = 0;
		scope.keyboard = function() {
			console.log('OK');
		}
		scope.items = [1, 2, 3];
		scope.editing = "ee1";
		scope.select = function(event) {
			scope.checked = c++;
			var target = event.currentTarget ? event.currentTarget : event.srcElement;
				scope.editing = (target.checked) ? "ee2" : "ee1";
			console.log(scope.editing);
			template.render();
		}
		scope.clickHandler = function(event, it) {
			console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
			console.log(event.srcElement);
			if (++c > 10) return;
			console.log(it)
			scope.checked = !scope.checked;
			template.render();
//			return false;
		}
		template.render();
	}

	todo.Template = function( template, scope ) {

		var todos = scope.todos = typeof localStorage !== 'undefined' ? JSON.parse( localStorage.getItem( STORE_KEY ) || '[]' ) : [];

		var render = function() {

			scope.active = getActiveItems( scope.todos );
			scope.completed = scope.todos.length - scope.active;
			scope.allCompleted = scope.todos.length > 0 && scope.active == 0 ? true : false;
			scope.clearCompletedVisible = scope.completed > 0 ? true : false;
			scope.footerVisible = scope.todos.length > 0 ? true : false;
			scope.itemLabel = scope.active === 1 ? 'item' : 'items';

			if (typeof localStorage !== 'undefined') localStorage.setItem( STORE_KEY, JSON.stringify( todos ) );

			template.render();

		}.bind( this );

		scope.completedClass = function( completed ) {
			return completed ? 'completed' : '';
		};


		scope.add = function( event ) {
			console.log('add');
			var value = getTarget(event).value.trim();
			if ( event.keyCode === ENTER_KEY && value !== '' ) {
				todos.push({
					title: value,
					completed: false
				});
				render();
				getTarget(event).value = '';
			}
		};

		scope.remove = function( event, todo ) {
			if ( todo ) {
				todos.splice( todos.indexOf( todo ), 1 );
				render();
			}
		};

		scope.toggle = function( event, todo ) {
			todo.completed = !todo.completed;
			render();
		};

		scope.edit = function( event, todo ) {
			todo.editing = "editing";
			render();
		};

		scope.update = function( event, todo ) {
			var value = getTarget(event).value.trim();
			if ( event.keyCode === ENTER_KEY ) {
				if ( value ) {
					todo.title = value;
				}
				else {
					todos.splice(todos.indexOf(todo), 1);
				}
				todo.editing = "";
				render();
			}
		};

		scope.toggleAll = function( event ) {
			todos.forEach(function( todo ) {
				todo.completed = getTarget(event).checked;
			});
			render();
		};

		scope.clearCompleted = function() {
			todos = scope.todos = todos.filter(function( todo ) {
				return !todo.completed;
			});
			render();
		};

		scope.clear = function( event ) {
			getTarget(event).value = '';
		};

		function getTarget(event) {
			return (event.currentTarget) ? event.currentTarget : event.srcElement;
		}

		function getActiveItems( data ) {
			return todos.filter(function( todo ) {
				return !todo.completed;
			}).length;
		};

		render();

	};

})( window );
