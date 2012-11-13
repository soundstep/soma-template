from pygments import highlight
from pygments.lexers import JavascriptLexer
from pygments.formatters import HtmlFormatter

# code = 'function HelloWorld() {\n\
# 	alert("hello");\n\
# }'
code = """<div id="target">{{name}}</div>
<script type="text/javascript">
	var target = document.getElementById("target");
	var template = soma.template.create(target);
</script>
"""
#code = 'var template = require("soma-template");'

print highlight(code, JavascriptLexer(), HtmlFormatter())