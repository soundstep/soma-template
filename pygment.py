from pygments import highlight
from pygments.lexers import HtmlDjangoLexer
from pygments.formatters import HtmlFormatter

code = """<div id="target">
  <button id ="bt">Click me</button>
</div>
<script>
  soma.template.addEvent(document.getElementById('bt'), 'click', handler);
  function handler(event) {
    alert('The event: "' + event.type + '", has been triggered!');
  }
</script>
"""

print highlight(code, HtmlDjangoLexer(), HtmlFormatter())