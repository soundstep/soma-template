from pygments import highlight
from pygments.lexers import HtmlDjangoLexer
from pygments.formatters import HtmlFormatter

code = """<div id="target">
  <div data-html>{{firstLine}}{{secondLine}}</div>
</div>
<script>
  template.scope.firstLine = 'first line<br/>';
  template.scope.secondLine = 'second line';
  template.render();
</script>
"""

print highlight(code, HtmlDjangoLexer(), HtmlFormatter())
