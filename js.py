from pygments import highlight
from pygments.lexers import JavascriptLexer
from pygments.formatters import HtmlFormatter

#code = 'function HelloWorld() {\n\
#	alert("hello");\n\
#}'
code = '$ npm install soma-template'

print highlight(code, JavascriptLexer(), HtmlFormatter())