from pygments import highlight
from pygments.lexers import HtmlDjangoLexer
from pygments.formatters import HtmlFormatter

code = """<script type="text/javascript">
settings.vars.index = "_index";
settings.vars.key = "_key";
</script>
"""

print highlight(code, HtmlDjangoLexer(), HtmlFormatter())