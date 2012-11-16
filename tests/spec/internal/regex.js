describe("internal - regex", function () {

	beforeEach(function () {
		createContainer();
		createTemplate();
	});

	afterEach(function () {
		disposeTemplate();
		disposeContainer();
	});

	it("sequence", function () {
		// regex.sequence (match) should separate in an array the tokens and non-tokens parts
		expect("".match(regex.sequence)).toBeNull();
		expect("string".match(regex.sequence)).toEqual(['string']);
		expect("{{name}}".match(regex.sequence)).toEqual(['{{name}}']);
		expect("name}".match(regex.sequence)).toEqual(['name}']);
		expect("{name".match(regex.sequence)).toEqual(['{name']);
		expect("{name}".match(regex.sequence)).toEqual(['{name}']);
		expect("{name} {{name}}".match(regex.sequence)).toEqual(['{name} ', '{{name}}']);
		// string
		expect("s{{name}}".match(regex.sequence)).toEqual(['s', '{{name}}']);
		expect("{{name}}s".match(regex.sequence)).toEqual(['{{name}}', 's']);
		expect("s{{name}}s".match(regex.sequence)).toEqual(['s', '{{name}}', 's']);
		expect("{{name}}s{{name}}".match(regex.sequence)).toEqual(['{{name}}', 's', '{{name}}']);
		// space
		expect(" {{name}}".match(regex.sequence)).toEqual([' ', '{{name}}']);
		expect("{{name}} ".match(regex.sequence)).toEqual(['{{name}}', ' ']);
		expect(" {{name}} ".match(regex.sequence)).toEqual([' ', '{{name}}', ' ']);
		expect("{{name}} {{name}}".match(regex.sequence)).toEqual(['{{name}}', ' ', '{{name}}']);
		// tab
		expect("	{{name}}".match(regex.sequence)).toEqual(['	', '{{name}}']);
		expect("{{name}}	".match(regex.sequence)).toEqual(['{{name}}', '	']);
		expect("	{{name}}	".match(regex.sequence)).toEqual(['	', '{{name}}', '	']);
		expect("{{name}}	{{name}}".match(regex.sequence)).toEqual(['{{name}}', '	', '{{name}}']);
		// line break
		expect("\n{{name}}".match(regex.sequence)).toEqual(['\n', '{{name}}']);
		expect("{{name}}\n".match(regex.sequence)).toEqual(['{{name}}', '\n']);
		expect("\n{{name}}\n".match(regex.sequence)).toEqual(['\n', '{{name}}', '\n']);
		expect("{{name}}\n{{name}}".match(regex.sequence)).toEqual(['{{name}}', '\n', '{{name}}']);
	});

	it("token", function () {
		// regex.token (match) should find only 1 token (see regex.sequence for multiple tokens)
		expect("".match(regex.token)).toBeNull();
		expect("string".match(regex.token)).toBeNull();
		expect("{name}".match(regex.token)).toBeNull();
		expect("{{name}".match(regex.token)).toBeNull();
		expect("{name}}".match(regex.token)).toBeNull();
		expect("{{name}}".match(regex.token)).toEqual(['{{name}}']);
		expect("a{{name}}".match(regex.token)).toEqual(['{{name}}']);
		expect("{{name}}a".match(regex.token)).toEqual(['{{name}}']);
		expect("a{{name}}a".match(regex.token)).toEqual(['{{name}}']);
	});

	it("expression", function () {
		// regex.expression (replace) is used to trim the token characters from a token
		expect("".replace(regex.expression, '')).toEqual('');
		expect("string".replace(regex.expression, '')).toEqual('string');
		expect("string}".replace(regex.expression, '')).toEqual('string}');
		expect("{string".replace(regex.expression, '')).toEqual('{string');
		expect("{string}".replace(regex.expression, '')).toEqual('{string}');
		expect("{{string}}".replace(regex.expression, '')).toEqual('string');
		expect("{{string}}".replace(regex.expression, '')).toEqual('string');
	});

	it("escape", function () {
		// regex.escape (replace) is used to escape special characters to use them in regular expressions
		expect("".replace(regex.escape, '\\$&')).toEqual("");
		expect(" ".replace(regex.escape, '\\$&')).toEqual(" ");
		expect("{".replace(regex.escape, '\\$&')).toEqual("\\{");
		expect("{{".replace(regex.escape, '\\$&')).toEqual("\\{\\{");
		expect("{{{".replace(regex.escape, '\\$&')).toEqual("\\{\\{\\{");
		expect("}".replace(regex.escape, '\\$&')).toEqual("\\}");
		expect("}}".replace(regex.escape, '\\$&')).toEqual("\\}\\}");
		expect("}}}".replace(regex.escape, '\\$&')).toEqual("\\}\\}\\}");
		expect("\ ^ $ * + ? . ( ) | { } [ ]".replace(regex.escape, '\\$&')).toEqual(" \\^ \\$ \\* \\+ \\? \\. \\( \\) \\| \\{ \\} \\[ \\]");
	});

	it("trim", function () {
		// regex.trim (replace) is used to remove the spaces, tabs or line break at the beginning and end of a string
		expect("".replace(regex.trim, '')).toEqual("");
		expect(" ".replace(regex.trim, '')).toEqual("");
		expect("s ".replace(regex.trim, '')).toEqual("s");
		expect(" s".replace(regex.trim, '')).toEqual("s");
		expect(" s ".replace(regex.trim, '')).toEqual("s");
		expect(" s s ".replace(regex.trim, '')).toEqual("s s");
		expect("	".replace(regex.trim, '')).toEqual("");
		expect("	s	".replace(regex.trim, '')).toEqual("s");
		expect("s	".replace(regex.trim, '')).toEqual("s");
		expect("	s".replace(regex.trim, '')).toEqual("s");
		expect("	s	s	".replace(regex.trim, '')).toEqual("s	s");
		expect("\n".replace(regex.trim, '')).toEqual("");
		expect("s\n".replace(regex.trim, '')).toEqual("s");
		expect("\ns".replace(regex.trim, '')).toEqual("s");
		expect("\ns\n".replace(regex.trim, '')).toEqual("s");
		expect("\ns\ns\n".replace(regex.trim, '')).toEqual("s\ns");
	});

	it("repeat", function () {
		// regex.repeast (match) is used to get the 3 different parts of a data-repeat attribute ("item in items")
		expect("".match(regex.repeat)).toBeNull();
		expect("string".match(regex.repeat)).toBeNull();
		expect("item in".match(regex.repeat)).toBeNull();
		expect("in items".match(regex.repeat)).toBeNull();
		var matches = "item in items".match(regex.repeat);
		expect(matches.length).toEqual(3);
		expect(matches[0]).toEqual('item in items');
		expect(matches[1]).toEqual('item');
		expect(matches[2]).toEqual('items');
	});

	it("func", function () {
		// regex.func (match) is used to extract the parameters from a function
		expect("func()".match(regex.func)[2]).toEqual('');
		expect("func(p)".match(regex.func)[2]).toEqual('p');
		expect("func(p.s)".match(regex.func)[2]).toEqual('p.s');
		expect("func(p.s, p.s)".match(regex.func)[2]).toEqual('p.s, p.s');
		expect("func('p')".match(regex.func)[2]).toEqual("'p'");
		expect("func('p.s')".match(regex.func)[2]).toEqual("'p.s'");
		expect("func('p.s', 'p.s')".match(regex.func)[2]).toEqual("'p.s', 'p.s'");
		expect('func("p")'.match(regex.func)[2]).toEqual('"p"');
		expect('func("p.s")'.match(regex.func)[2]).toEqual('"p.s"');
		expect('func("p.s", "p.s")'.match(regex.func)[2]).toEqual('"p.s", "p.s"');
	});

	it("params", function () {
		// regex.params (split) is used to create an array from a param string
		expect("".split(regex.params)).toEqual(['']);
		expect("p".split(regex.params)).toEqual(['p']);
		expect("p,p".split(regex.params)).toEqual(['p', 'p']);
		expect("p, p".split(regex.params)).toEqual(['p', 'p']);
		expect("p.s".split(regex.params)).toEqual(['p.s']);
		expect("p.s,p.s".split(regex.params)).toEqual(['p.s', 'p.s']);
		expect("p.s, p.s".split(regex.params)).toEqual(['p.s', 'p.s']);
		expect("'p.s'".split(regex.params)).toEqual(["'p.s'"]);
		expect("'p.s','p.s'".split(regex.params)).toEqual(["'p.s'", "'p.s'"]);
		expect("'p.s', 'p.s'".split(regex.params)).toEqual(["'p.s'", "'p.s'"]);
		expect('"p.s"'.split(regex.params)).toEqual(['"p.s"']);
		expect('"p.s","p.s"'.split(regex.params)).toEqual(['"p.s"', '"p.s"']);
		expect('"p.s", "p.s"'.split(regex.params)).toEqual(['"p.s"', '"p.s"']);
	});

	it("quote", function () {
		// regex.quote (match and replace) is used to find string in params and remove the string
		expect("".match(regex.quote)).toBeNull();
		expect("p".match(regex.quote)).toBeNull();
		expect("p,p".match(regex.quote)).toBeNull();
		expect("p, p".match(regex.quote)).toBeNull();
		expect("p.s".match(regex.quote)).toBeNull();
		expect("'p.s'".replace(regex.quote, '')).toEqual("p.s");
		expect('"p.s"'.replace(regex.quote, '')).toEqual('p.s');
	});

	it("content", function () {
		// regex.content (test) is used to find if a string has anything else than spaces, tabs and line breaks
		expect(regex.content.test('')).toBeFalsy();
		expect(regex.content.test(' ')).toBeFalsy();
		expect(regex.content.test('	')).toBeFalsy();
		expect(regex.content.test('\n')).toBeFalsy();
		expect(regex.content.test('string')).toBeTruthy();
		expect(regex.content.test(' string')).toBeTruthy();
		expect(regex.content.test('	string')).toBeTruthy();
		expect(regex.content.test('\nstring')).toBeTruthy();
	});

	it("depth", function () {
		// regex.depth (match) is used to find the parent scope
		expect("name".match(regex.depth)).toBeNull();
		expect("../name".match(regex.depth)).toEqual(['../']);
		expect("../../name".match(regex.depth)).toEqual(['../', '../']);
	});

	it("string", function () {
		// regex.string (test) is used to find if a pattern is a string
		expect(regex.string.test('')).toBeFalsy();
		expect(regex.string.test('name')).toBeFalsy();
		expect(regex.string.test('func(var)')).toBeFalsy();
		expect(regex.string.test('func("str")')).toBeFalsy();
		expect(regex.string.test("func('str')")).toBeFalsy();
		expect(regex.string.test('"name"')).toBeTruthy();
		expect(regex.string.test("'name'")).toBeTruthy();
		expect(regex.string.test('"func(var)"')).toBeTruthy();
		expect(regex.string.test("'func(var)'")).toBeTruthy();
		expect(regex.string.test('"func("str")"')).toBeTruthy();
		expect(regex.string.test("'func('str')'")).toBeTruthy();
	});

	it("change token start regex 1 character", function () {
		settings.tokens.start('[');
		expect(settings.tokens.start()).toEqual('\\[');
		expect(regex.sequence.toString()).toEqual('/\\[.+?\\}\\}|[^\\[]+/g');
		var t1 = createTemplateWithContent('[name}}');
		t1.scope.name = "john";
		t1.render();
		expect(t1.element.innerHTML).toEqual('john');
		settings.tokens.start('{{');
	});

	it("change token start regex 2 characters", function () {
		settings.tokens.start('[[');
		expect(settings.tokens.start()).toEqual('\\[\\[');
		expect(regex.sequence.toString()).toEqual('/\\[\\[.+?\\}\\}|[^\\[\\[]+|\\[(?!\\[)[^[]*/g');
		var t1 = createTemplateWithContent('[[name}}');
		t1.scope.name = "john";
		t1.render();
		expect(t1.element.innerHTML).toEqual('john');
		settings.tokens.start('{{');
	});

	it("change token start regex 3 characters", function () {
		settings.tokens.start('[{-');
		expect(settings.tokens.start()).toEqual('\\[\\{\\-');
		expect(regex.sequence.toString()).toEqual('/\\[\\{\\-.+?\\}\\}|[^\\[\\{\\-]+|\\[(?!\\{)[^[]*/g');
		var t1 = createTemplateWithContent('[{-name}}');
		t1.scope.name = "john";
		t1.render();
		expect(t1.element.innerHTML).toEqual('john');
		settings.tokens.start('{{');
	});

	it("array", function () {
		// regex.array (match and replace) is used to find string in params and remove the string
		expect("".match(regex.array)).toBeNull();
		expect("name".match(regex.array)).toEqual(['name']);
		expect("name[]".match(regex.array)).toEqual(['name']);
		expect("name[0]".match(regex.array)).toEqual(['name', '0']);
		expect("name[9]".match(regex.array)).toEqual(['name', '9']);
		expect("name[100]".match(regex.array)).toEqual(['name', '100']);
	});

});
