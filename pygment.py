from pygments import highlight
from pygments.lexers import HtmlDjangoLexer
from pygments.formatters import HtmlFormatter

code = """<div id="target">
  <p>two people: {{person[0][0]}} + {{person[0][1]}}</p>
  <p>other people: {{person[1][0]}} + {{person[1][1]}}</p>
  <p>grouped: {{getAll(person)}}</p>
</div>
<script>
  template.scope.person = [
    ['john', 'david'],
    ['olivia', 'emily']
  ];
  template.scope.getAll = function(arr) {
    return arr.toString();
  }
  template.render();
</script>
"""

print highlight(code, HtmlDjangoLexer(), HtmlFormatter())