from pygments import highlight
from pygments.lexers import HtmlDjangoLexer
from pygments.formatters import HtmlFormatter

code = """<div id="target">
  <p data-repeat="item in items">This key is: {{$key}}</p>
</div>
<script>
  var template = soma.template.create(document.getElementById('target'));
  template.scope.items = {
    'firstname': 1,
    'surname': 2,
    'age': 3,
  };
  template.render();
</script>
"""

print highlight(code, HtmlDjangoLexer(), HtmlFormatter())
