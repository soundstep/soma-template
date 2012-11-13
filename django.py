from pygments import highlight
from pygments.lexers import HtmlDjangoLexer
from pygments.formatters import HtmlFormatter

code = """<div id="target">
  <p class="bold {{styles.color}}">
    I am {{utils.makeOlder(person.age, "years old")}}.
  </p>
  </div>
  <script>
  template.scope.styles = {
    color: "color"
  };
  template.scope.person = {
    age: 21
  };
  template.scope.utils = {
    makeOlder: function(age, type) {
      return (age*2) + " " + type;
    }
  };
  template.render();
</script>
"""

print highlight(code, HtmlDjangoLexer(), HtmlFormatter())