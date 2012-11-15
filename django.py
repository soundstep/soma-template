from pygments import highlight
from pygments.lexers import HtmlDjangoLexer
from pygments.formatters import HtmlFormatter

code = """<div id="target">
  <p class="{{color}}">Only the class attribute is rendered {{content}}.</p>
</div>
<script>
  template.scope.color = "color";
  template.scope.content = "text not rendered";
  var attribute = template.node.children[0].getAttribute("class");
  attribute.update();
  attribute.render();
</script>
"""

print highlight(code, HtmlDjangoLexer(), HtmlFormatter())