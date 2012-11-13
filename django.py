from pygments import highlight
from pygments.lexers import HtmlDjangoLexer
from pygments.formatters import HtmlFormatter

code = """<div id="target">
  <p>{{tweets.results.length}} tweets retrieved in {{tweets.completed_in}} seconds.</p>
</div>
<script>
  var template = soma.template.create(document.getElementById('target'));
  $.ajax({
    type:'GET',
	url: 'http://search.twitter.com/search.json?q=template',
	  dataType:'jsonp',
	  success:function (data) {
	    template.scope.tweets = data;
	    template.render();
	  }
  });
</script>
"""

print highlight(code, HtmlDjangoLexer(), HtmlFormatter())