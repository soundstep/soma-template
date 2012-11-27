if (settings.autocreate) {
	var ready = (function(ie,d){d=document;return ie?
		function(c){var n=d.firstChild,f=function(){try{c(n.doScroll('left'))}catch(e){setTimeout(f,10)}};f()}:/webkit|safari|khtml/i.test(navigator.userAgent)?
		function(c){var f=function(){/loaded|complete/.test(d.readyState)?c():setTimeout(f,10)};f()}:
		function(c){d.addEventListener("DOMContentLoaded", c, false)}
	})(/*@cc_on 1@*/);
	var parse = function(element) {
		var child = !element ? document.body.firstChild : element.firstChild;
		while (child) {
			if (child.nodeType === 1) {
				parse(child);
				var attrValue = child.getAttribute(attributes.template);
				if (attrValue) {
					var getFunction = new Function('return ' + attrValue + ';');
					try {
						var f = getFunction();
						if (isFunction(f)) {
							soma.template.bootstrap(attrValue, child, f);
						}
					} catch(err){};
				}
			}
			child = child.nextSibling;
		}
	};
	ready(parse);
}
function bootstrapTemplate(attrValue, element, func) {
	var tpl = createTemplate(element);
	func(tpl, tpl.scope, tpl.element, tpl.node);
}