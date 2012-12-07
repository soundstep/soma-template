from pygments import highlight
from pygments.lexers import HtmlDjangoLexer
from pygments.formatters import HtmlFormatter

code = """<div id="target">
  <button id="ct1" >Click</button>
  <input id="ct2" type="text" value="type something">
</div>
<script>
  var template = soma.template.create(document.getElementById('target'));
  template.scope.handler = function(event) {
    alert('The event: "' + event.type + '", has been triggered!')
  }
  var button = template.getNode(document.getElementById('ct1'));
  var input = template.getNode(document.getElementById('ct2'));
  button.addEvent('click', 'handler()');
  input.addEvent('keypress', 'handler()');
  template.render();
</script>
"""

print highlight(code, HtmlDjangoLexer(), HtmlFormatter())