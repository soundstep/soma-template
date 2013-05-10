	// written by Dean Edwards, 2005
	// with input from Tino Zijdel, Matthias Miller, Diego Perini
	// http://dean.edwards.name/weblog/2005/10/add-event/
	function addEvent(element, type, handler) {
		if (element.addEventListener) {
			element.addEventListener(type, handler, false);
		} else {
			// assign each event handler a unique ID
			if (!handler.$$guid) {
				handler.$$guid = addEvent.guid++;
			}
			// create a hash table of event types for the element
			if (!element.events) {
				element.events = {};
			}
			// create a hash table of event handlers for each element/event pair
			var handlers = element.events[type];
			if (!handlers) {
				handlers = element.events[type] = {};
				// store the existing event handler (if there is one)
				if (element['on' + type]) {
					handlers[0] = element['on' + type];
				}
			}
			// store the event handler in the hash table
			handlers[handler.$$guid] = handler;
			// assign a global event handler to do all the work
			element['on' + type] = function(event) {
				var returnValue = true;
				// grab the event object (IE uses a global event object)
				event = event || fixEvent(((this.ownerDocument || this.document || this).parentWindow || window).event);
				// get a reference to the hash table of event handlers
				var handlers = this.events[event.type];
				// execute each event handler
				for (var i in handlers) {
					if (handlers.hasOwnProperty(i)) {
						this.$$handleEvent = handlers[i];
						if (this.$$handleEvent(event) === false) {
							returnValue = false;
						}
					}
				}
				return returnValue;
			};
		}
	}
	// a counter used to create unique IDs
	addEvent.guid = 1;
	function removeEvent(element, type, handler) {
		if (element.removeEventListener) {
			element.removeEventListener(type, handler, false);
		} else {
			// delete the event handler from the hash table
			if (element.events && element.events[type]) {
				delete element.events[type][handler.$$guid];
			}
		}
	}
	function fixEvent(event) {
		// add W3C standard event methods
		event.preventDefault = fixEvent.preventDefault;
		event.stopPropagation = fixEvent.stopPropagation;
		return event;
	}
	fixEvent.preventDefault = function() {
		this.returnValue = false;
	};
	fixEvent.stopPropagation = function() {
		this.cancelBubble = true;
	};

	var maxDepth;
	var eventStore = [];

	function parseEvents(element, object, depth) {
		maxDepth = depth === undefined ? Number.MAX_VALUE : depth;
		parseNode(element, object, 0, true);
	}

	function parseNode(element, object, depth, isRoot) {
		if (!isElement(element)) {
			throw new Error('Error in soma.template.parseEvents, only a DOM Element can be parsed.');
		}
		if (isRoot) {
			parseAttributes(element, object);
		}
		if (maxDepth === 0) {
			return;
		}
		var child = element.firstChild;
		while (child) {
			if (child.nodeType === 1) {
				if (depth < maxDepth) {
					parseNode(child, object, ++depth);
					parseAttributes(child, object);
				}
			}
			child = child.nextSibling;
		}
	}

	function parseAttributes(element, object) {
		for (var attr, name, value, attrs = element.attributes, j = 0, jj = attrs && attrs.length; j < jj; j++) {
			attr = attrs[j];
			if (attr.specified) {
				name = attr.name;
				value = attr.value;
				if (events[name]) {
					var handler = getHandlerFromPattern(object, value);
					if (handler && isFunction(handler)) {
						addEvent(element, events[name], handler);
						eventStore.push({element:element, type:events[name], handler:handler});
					}
				}
			}
		}
	}

	function getHandlerFromPattern(object, pattern) {
		var parts = pattern.match(regex.func);
		if (parts) {
			var func = parts[1];
			if (isFunction(object[func])) {
				return object[func];
			}
		}
	}

	function clearEvents(element) {
		var i = eventStore.length, l = 0;
		while (--i >= l) {
			var item = eventStore[i];
			if (element === item.element || contains(element, item.element)) {
				removeEvent(item.element, item.type, item.handler);
				eventStore.splice(i, 1);
			}
		}
	}

