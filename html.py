from pygments import highlight
from pygments.lexers import HtmlLexer
from pygments.formatters import HtmlFormatter

#code = 'function HelloWorld() {\n\
#	alert("hello");\n\
#}'
code = '<script type="text/javascript" src="soma-template.js"></script>'

print highlight(code, HtmlLexer(), HtmlFormatter())