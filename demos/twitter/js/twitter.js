;(function (ns, template, $, undefined) {

	var Twitter = function() {

		var tpl = template.create(document.getElementById('twitter'));
		var scope = tpl.node.scope;
		var service = new TwitterService();

		scope.message = "";
		scope.search = function(event) {
			var value = event.currentTarget.value;
			if (event.which === 13 && value !== "") {
				scope.message = "searching..."
				tpl.render();
				service.search(value, successHandler);
			}
		}
		scope.visit = function(event, user, id) {
			window.open("http://twitter.com/" + user + "/statuses/" + id);
		}
		tpl.render();

		function successHandler(data) {
			scope.results = data.results;
			scope.message = "search result: " + data.results.length;
			tpl.render();
		}

		scope.getClassRow = function(index) {
			return "row-" + (index % 2 === 0 ? "even" : "odd");
		}

	}

	var TwitterService = function (dispatcher) {
		var url = "http://search.twitter.com/search.json";
		return {
			search:function (query, successCallback, errorCallback) {
				$.ajax({
					type:'GET',
					url:url + '?q=' + query,
					dataType:'jsonp',
					success:function (data) {
						successCallback(data);
					},
					error:function (data) {
						errorCallback(data);
					}
				});
			}
		}
	};

	var app = new Twitter();

})(this['ns'] = this['ns'] || {}, soma.template, $);
