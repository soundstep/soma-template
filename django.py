from pygments import highlight
from pygments.lexers import HtmlDjangoLexer
from pygments.formatters import HtmlFormatter

code = """<div id="target">Show my name: {{name}}, but not
my age: <span data-skip="true">{{age}}</span></div>
<script>
  template.scope.name = "John";
  template.scope.age = 21;
  template.render();
</script>
"""

print highlight(code, HtmlDjangoLexer(), HtmlFormatter())