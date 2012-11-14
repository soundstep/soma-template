from pygments import highlight
from pygments.lexers import HtmlDjangoLexer
from pygments.formatters import HtmlFormatter

code = """<div id="target">
  <input type="text" data-readonly="{{readonly}}" value="Read only?">
</div>
<script>
  template.scope.readonly = true;
  template.render();
</script>
"""

print highlight(code, HtmlDjangoLexer(), HtmlFormatter())