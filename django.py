from pygments import highlight
from pygments.lexers import HtmlDjangoLexer
from pygments.formatters import HtmlFormatter

code = """<script type="text/javascript">
var camelize = soma.template.helpers().camelize;
var camelize = template.scope._parent.camelize;
</script>
"""

print highlight(code, HtmlDjangoLexer(), HtmlFormatter())