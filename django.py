from pygments import highlight
from pygments.lexers import HtmlDjangoLexer
from pygments.formatters import HtmlFormatter

code = """<div id="target"><div class="{{color}}">{{content}}</div></div>
<script>
  template.scope.color = "color-red";
  template.scope.content = "This paragraph is not red";
  template.watch(template.element.firstChild, function(oldValue, newValue, pattern, scope, node, attribute) {
    if (attribute) return "color-blue";
    else return newValue + " and has been watched as well!";
  });
template.render();
</script>
"""

print highlight(code, HtmlDjangoLexer(), HtmlFormatter())