from pygments import highlight
from pygments.lexers import HtmlDjangoLexer
from pygments.formatters import HtmlFormatter

code = """<div id="target">
  <div data-class='{"red": true}'>A data class switch</div>
  <div data-class='{"red": false}'>A data class switch</div>
</div>
<script>
  var template = soma.template.create(document.getElementById('target'));
  template.render();
</script>"""

print highlight(code, HtmlDjangoLexer(), HtmlFormatter())
