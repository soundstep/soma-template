describe("internal - helpers", function () {

	beforeEach(function () {
		createContainer();
		createTemplate();
	});

	afterEach(function () {
		disposeTemplate();
		disposeContainer();
	});

	it("is array", function () {
		expect(isArray([])).toBeTruthy();
		expect(isArray('string')).toBeFalsy();
		expect(isArray()).toBeFalsy();
	});

	it("is object", function () {
		expect(isObject({})).toBeTruthy();
		expect(isObject('string')).toBeFalsy();
		expect(isObject()).toBeFalsy();
	});

	it("is string", function () {
		expect(isString('string')).toBeTruthy();
		expect(isObject(1)).toBeFalsy();
		expect(isObject()).toBeFalsy();
	});

	it("is element", function () {
		ct.innerHTML = "text";
		expect(isElement(ct)).toBeTruthy();
		expect(isElement(ct.firstChild)).toBeTruthy();
		expect(isObject('string')).toBeFalsy();
		expect(isObject()).toBeFalsy();
	});

	it("is text node", function () {
		ct.innerHTML = "text";
		expect(isTextNode(ct)).toBeFalsy();
		expect(isTextNode(ct.firstChild)).toBeTruthy();
		expect(isTextNode('string')).toBeFalsy();
		expect(isTextNode()).toBeFalsy();
	});

	it("is function", function () {
		expect(isFunction(function(){})).toBeTruthy();
		expect(isFunction('string')).toBeFalsy();
		expect(isFunction()).toBeFalsy();
	});

	it("is defined", function () {
		expect(isDefined('')).toBeTruthy();
		expect(isDefined(1)).toBeTruthy();
		expect(isDefined(undefined)).toBeFalsy();
		expect(isDefined(null)).toBeFalsy();
		expect(isDefined()).toBeFalsy();
	});

	it("is attribute defined", function () {
		expect(isAttributeDefined('')).toBeTruthy();
		expect(isAttributeDefined(true)).toBeTruthy();
		expect(isAttributeDefined('true')).toBeTruthy();
		expect(isAttributeDefined(false)).toBeFalsy();
		expect(isAttributeDefined('false')).toBeFalsy();
		expect(isAttributeDefined(undefined)).toBeTruthy();
		expect(isAttributeDefined(null)).toBeTruthy();
	});

	it("is expression", function () {
		expect(isExpression(new Expression())).toBeTruthy();
		expect(isExpression({})).toBeFalsy();
		expect(isExpression()).toBeFalsy();
	});

	it("is node", function () {
		expect(isNode(new Node())).toBeTruthy();
		expect(isNode({})).toBeFalsy();
		expect(isNode()).toBeFalsy();
	});

	it("is expression function", function () {
		expect(isExpFunction('func()')).toBeTruthy();
		expect(isExpFunction('func(p)')).toBeTruthy();
		expect(isExpFunction('func("p")')).toBeTruthy();
		expect(isExpFunction('path.func()')).toBeTruthy();
		expect(isExpFunction('path.func(p)')).toBeTruthy();
		expect(isExpFunction('path.func("p")')).toBeTruthy();
		expect(isExpFunction('path.path.func()')).toBeTruthy();
		expect(isExpFunction('path.path.func(p)')).toBeTruthy();
		expect(isExpFunction('path.path.func("p")')).toBeTruthy();
		expect(isExpFunction('')).toBeFalsy();
		expect(isExpFunction({})).toBeFalsy();
		expect(isExpFunction()).toBeFalsy();
	});

//	it("is node template", function () {
//		var div = doc.createElement('div');
//		ct.appendChild(div);
//		tpl.compile();
//		var t1 = soma.template.create(div);
//		expect(childNodeIsTemplate(tpl.node)).toBeFalsy();
//		expect(childNodeIsTemplate(tpl.node.children[0])).toBeTruthy();
//	});

	it("escape reg exp", function () {
		var str = "\ ^ $ * + ? . ( ) | { } [ ]";
		expect(escapeRegExp(str)).toEqual(" \\^ \\$ \\* \\+ \\? \\. \\( \\) \\| \\{ \\} \\[ \\]");
	});

	it("set regex", function () {
		var currentRegExToken = regex.token;
		soma.template.settings.tokens.start('[[');
		soma.template.settings.tokens.end(']]');
		expect(regex.token.toString()).toEqual('/\\[\\[.*?\\]\\]/g');
		soma.template.settings.tokens.start('{{');
		soma.template.settings.tokens.end('}}');
	});

	it("getExpArrayParts", function () {
		expect(isExpFunction('func()')).toBeTruthy();
		expect(isExpFunction('func(p)')).toBeTruthy();
		expect(isExpFunction('func("p")')).toBeTruthy();
		expect(isExpFunction('path.func()')).toBeTruthy();
		expect(isExpFunction('path.func(p)')).toBeTruthy();
		expect(isExpFunction('path.func("p")')).toBeTruthy();
		expect(isExpFunction('path.path.func()')).toBeTruthy();
		expect(isExpFunction('path.path.func(p)')).toBeTruthy();
		expect(isExpFunction('path.path.func("p")')).toBeTruthy();
		expect(isExpFunction('')).toBeFalsy();
		expect(isExpFunction({})).toBeFalsy();
		expect(isExpFunction()).toBeFalsy();
	});

	it("trim", function () {
		expect(trim('string')).toEqual('string');
		// space
		expect(trim('str ing')).toEqual('str ing');
		expect(trim(' str ing')).toEqual('str ing');
		expect(trim('str ing ')).toEqual('str ing');
		expect(trim(' str ing ')).toEqual('str ing');
		// tab
		expect(trim('str	ing')).toEqual('str	ing');
		expect(trim('	str	ing')).toEqual('str	ing');
		expect(trim('str	ing	')).toEqual('str	ing');
		expect(trim('	str	ing	')).toEqual('str	ing');
		// line break
		expect(trim('str\ning')).toEqual('str\ning');
		expect(trim('\nstr\ning')).toEqual('str\ning');
		expect(trim('str\ning\n')).toEqual('str\ning');
		expect(trim('\nstr\ning\n')).toEqual('str\ning');
		//multiple
		expect(trim('str 	\ning')).toEqual('str 	\ning');
		expect(trim(' 	\nstr 	\ning')).toEqual('str 	\ning');
		expect(trim('str 	\ning 	\n')).toEqual('str 	\ning');
		expect(trim(' 	\nstr 	\ning 	\n')).toEqual('str 	\ning');
	});

	it("trim quotes", function () {
		expect(trimQuotes('')).toEqual('');
		expect(trimQuotes('name')).toEqual('name');
		expect(trimQuotes('"name"')).toEqual('name');
		expect(trimQuotes("'name'")).toEqual('name');
		expect(trimQuotes("'na'me'")).toEqual("na'me");
		expect(trimQuotes('"na"me"')).toEqual('na"me');
	});

	it("trim array", function () {
		expect(trimArray([1, '', 2])).toEqual([1, '', 2]);
		expect(trimArray(['', 1, '', 2])).toEqual([1, '', 2]);
		expect(trimArray([1, '', 2, ''])).toEqual([1, '', 2]);
		expect(trimArray(['', 1, '', 2, ''])).toEqual([1, '', 2]);
	});

	it("trim token", function () {
		expect(trimTokens('{{name}}')).toEqual('name');
	});

	it("trim depth", function () {
		expect(trimScopeDepth('')).toEqual('');
		expect(trimScopeDepth('name')).toEqual('name');
		expect(trimScopeDepth('../name')).toEqual('name');
		expect(trimScopeDepth('../../name')).toEqual('name');
	});

	it("insert after", function () {
		ct.innerHTML = "<p></p>";
		insertAfter(ct.firstChild, doc.createElement('span'));
		expect(ct.childNodes[0].nodeName.toLowerCase()).toEqual('p');
		expect(ct.childNodes[1].nodeName.toLowerCase()).toEqual('span');
	});

	it("insert before", function () {
		ct.innerHTML = "<p></p>";
		insertBefore(ct.firstChild, doc.createElement('span'));
		expect(ct.childNodes[0].nodeName.toLowerCase()).toEqual('span');
		expect(ct.childNodes[1].nodeName.toLowerCase()).toEqual('p');
	});

	it("remove class", function() {
		ct.innerHTML = '<p></p>';
		removeClass(ct.firstChild, 'cl')
		expect(ct.firstChild.className.replace(/\s/g, '')).toEqual('');
		ct.innerHTML = '<p class="cl"></p>';
		removeClass(ct.firstChild, 'cl')
		expect(ct.firstChild.className.replace(/\s/g, '')).toEqual('');
		ct.innerHTML = '<p class=" cl "></p>';
		removeClass(ct.firstChild, 'cl')
		expect(ct.firstChild.className.replace(/\s/g, '')).toEqual('');
		ct.innerHTML = '<p class="cl bold"></p>';
		removeClass(ct.firstChild, 'cl')
		expect(ct.firstChild.className.replace(/\s/g, '')).toEqual('bold');
	});

	it("create hash map", function() {
		var map = new HashMap();
		expect(map).toBeDefined();
		expect(map).not.toBeNull();
		expect(map.getData()).toEqual({});
	});

	it("hash map put, get and remove", function() {
		var map = new HashMap();
		// number
		map.put(1, 'string');
		expect(map.get(1)).toBeDefined();
		expect(map.get(1)).toEqual('string');
		map.remove(1);
		expect(map.get(1)).toBeUndefined();
		// string
		map.put('str', 'string');
		expect(map.get('str')).toBeDefined();
		expect(map.get('str')).toEqual('string');
		map.remove('str');
		expect(map.get('str')).toBeUndefined();
		// object
		var obj = {};
		map.put(obj, 'string');
		expect(map.get(obj)).toBeDefined();
		expect(map.get(obj)).toEqual('string');
		map.remove(obj);
		expect(map.get(obj)).toBeUndefined();
		// array
		var arr = [];
		map.put(arr, 'string');
		expect(map.get(arr)).toBeDefined();
		expect(map.get(arr)).toEqual('string');
		map.remove(arr);
		expect(map.get(arr)).toBeUndefined();
		// element
		map.put(ct, 'string');
		expect(map.get(ct)).toBeDefined();
		expect(map.get(ct)).toEqual('string');
		map.remove(ct);
		expect(map.get(ct)).toBeUndefined();
	});

	it("hash dispose", function() {
		var map = new HashMap();
		var obj = {};
		var arr = [];
		map.put(1, 'string');
		map.put('str', 'string');
		map.put(obj, 'string');
		map.put(arr, 'string');
		map.put(ct, 'string');
		map.dispose();
		expect(map.get(1)).toBeUndefined();
		expect(map.get('str')).toBeUndefined();
		expect(map.get(obj)).toBeUndefined();
		expect(map.get(arr)).toBeUndefined();
		expect(map.get(ct)).toBeUndefined();
	});

	it("hash data", function() {
		var map = new HashMap();
		var obj = {};
		var arr = [];
		map.put(1, 'string');
		map.put('str', 'string');
		map.put(obj, 'string');
		map.put(arr, 'string');
		map.put(ct, 'string');
		var data = map.getData();
		var clone = {};
		var count = 0;
		for (var k in data) {
			expect(typeof k).toEqual('string');
			clone[k] = data[k];
			count++;
		}
		expect(clone).toEqual(data);
		expect(count).toEqual(5);
	});

	it("hash data", function() {
		var map = new HashMap();
		var obj = {};
		var arr = [];
		map.put(1, 'string');
		map.put('str', 'string');
		map.put(obj, 'string');
		map.put(arr, 'string');
		map.put(ct, 'string');
		var data = map.getData();
		var clone = {};
		var count = 0;
		for (var k in data) {
			expect(typeof k).toEqual('string');
			clone[k] = data[k];
			count++;
		}
		expect(clone).toEqual(data);
		expect(count).toEqual(5);
	});

});
