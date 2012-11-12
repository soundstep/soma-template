from pygments import highlight
from pygments.lexers import JavascriptLexer
from pygments.formatters import HtmlFormatter

#code = 'function HelloWorld() {\n\
#	alert("hello");\n\
#}'
code = 'var template = require("soma-template");'

print highlight(code, JavascriptLexer(), HtmlFormatter())