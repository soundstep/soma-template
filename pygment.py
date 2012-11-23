from pygments import highlight
from pygments.lexers import HtmlDjangoLexer
from pygments.formatters import HtmlFormatter

code = """<div data-template="Template">{{name}}</div>
<script>
  function Template(template, scope, element, node) {
    scope.name = "john";
    template.render();
  }
</script>
"""

print highlight(code, HtmlDjangoLexer(), HtmlFormatter())