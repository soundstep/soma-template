;(function (ns, template, $, undefined) {

	var Application = function() {
		var tpl = template.create($('.twitter')[0]);
		var scope = tpl.node.scope;
		var service = new TwitterService();

		scope.message = "";
		tpl.render();

		$('.queryInput').keypress(function (event) {
			if (event.keyCode === 13 && this.value !== "") {
				scope.message = "searching..."
				tpl.render();
				service.search($(this).val(), successHandler);
			}
		});

		$('.result').on('click', 'li', function() {
			window.open("http://twitter.com/" + $(this).attr('data-user') + "/statuses/" + $(this).attr('data-id'));
		});

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

	var app = new Application();

})(this['ns'] = this['ns'] || {}, soma.template, $);
