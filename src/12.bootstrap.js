if (settings.autocreate && typeof document === 'object') {
	// https://github.com/ded/domready
	var ready=function(){function l(b){for(k=1;b=a.shift();)b()}var b,a=[],c=!1,d=document,e=d.documentElement,f=e.doScroll,g="DOMContentLoaded",h="addEventListener",i="onreadystatechange",j="readyState",k=/^loade|c/.test(d[j]);return d[h]&&d[h](g,b=function(){d.removeEventListener(g,b,c),l()},c),f&&d.attachEvent(i,b=function(){/^c/.test(d[j])&&(d.detachEvent(i,b),l())}),f?function(b){self!=top?k?b():a.push(b):function(){try{e.doScroll("left")}catch(a){return setTimeout(function(){ready(b)},50)}b()}()}:function(b){k?b():a.push(b)}}();
	var parse = function(element) {
		var child = !element ? document.body : element.firstChild;
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