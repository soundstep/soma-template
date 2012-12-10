from pygments import highlight
from pygments.lexers import HtmlDjangoLexer
from pygments.formatters import HtmlFormatter

code = """  <script>
soma.template.settings.events['custom-click'] = 'click';
soma.template.settings.events['custom-mouseover'] = 'mouseover';
</script>
"""

print highlight(code, HtmlDjangoLexer(), HtmlFormatter())