var obj1 = {
	img: "assets/img0.jpg",
	imgrep: [
		"img",
		"img"
	],
	hideValue: true,
	showValue: true,
	link: "www.google.com",
	test1:"String 1 [v1]",
	test2:"String 2 [v1]",
	test3: {
		obj: {
			val: "val3 [v1]",
			cl: "myClass3"
		}
	},
	params: {
		param1: "p1.p1",
		param2: "p2.p2"
	},
	getClass: function(){ return "myClassA"; },
	fnParam: function(p1, p2){ return p1 === "p1.p1" && p2 === "p2.p2" ? "fn value [v1]" : undefined; },
	getClassParam: function(p1, p2){ return p1 === "p1.p1" && p2 === "p2.p2" ? "myClass5" : undefined; },
	functions: {
		getClass: function(){ return "myClass4"; },
		getClassParam: function(p1, p2){ return p1 === "p1.p1" && p2 === "p2.p2" ? "myClass5" : undefined; },
		fn1: function(){ return "fn string returned [v1]"; },
		fn2: function(p1, p2){ return "fn string returned with: " + p1 + " " + p2 + " [v1]"; },
		fnParam: function(p1, p2){ return p1 === "p1.p1" && p2 === "p2.p2" ? "fn value [v1]" : undefined; },
		checked: function() { return "checked"; },
		hideFn: function(){ return true; },
		showFn: function(){ return true; },
		deep: {
			fn1: function(){ return "fn deep string returned [v2]"; }
		}
	},
	cl:"myClass",
	cl2:"myClass2",
	checked: 'checked',
	items: [{name:"zero [v1]", deep:{other:"1 [v1]"}}, {name:"one [v1]", deep:{other:"2 [v1]"}}, {name:"two [v1]", deep:{other:"3 [v1]"}}],
	arr:["zero [v1]", "one [v1]", "two [v1]"],
	obj: {
		title: "object containing arrays",
		data: [1, 2, 3]
	},
	l0: [
		[
			["0-0-1 [v1]", "0-0-1 [v1]", "0-0-2 [v1]"],
			["0-1-1 [v1]", "0-1-1 [v1]", "0-1-2 [v1]"],
			["0-2-1 [v1]", "0-2-1 [v1]", "0-2-2 [v1]"]
		],
		[
			["1-0-1 [v1]", "1-0-1 [v1]", "1-0-2 [v1]"],
			["1-1-1 [v1]", "1-1-1 [v1]", "1-1-2 [v1]"],
			["1-2-1 [v1]", "1-2-1 [v1]", "1-2-2 [v1]"]
		],
		[
			["2-0-1 [v1]", "2-0-1 [v1]", "2-0-2 [v1]"],
			["2-1-1 [v1]", "2-1-1 [v1]", "2-1-2 [v1]"],
			["2-2-1 [v1]", "2-2-1 [v1]", "2-2-2 [v1]"]
		]
	]
};

var obj2 = {
	img: "assets/img1.jpg",
	imgrep: [
		"img",
		"img"
	],
	hideValue: true,
	showValue: true,
	link: "http://www.google.com/",
	test1:"String 1 [v2]",
	test2:"String 2 [v2]",
	test3: {
		obj: {
			val: "val3 [v2]",
			cl: "myClass3"
		}
	},
	params: {
		param1: "p1.p1",
		param2: "p2.p2"
	},
	getClass: function(){ return "myClassA"; },
	fnParam: function(p1, p2){ return p1 === "p1.p1" && p2 === "p2.p2" ? "fn value [v1]" : undefined; },
	getClassParam: function(p1, p2){ return p1 === "p1.p1" && p2 === "p2.p2" ? "myClass5" : undefined; },
	functions: {
		getClass: function(){ return "myClass4"; },
		getClassParam: function(p1, p2){ return p1 === "p1.p1" && p2 === "p2.p2" ? "myClass6" : undefined; },
		fn1: function(){ return "fn string returned [v2]"; },
		fn2: function(p1, p2){ return "fn string returned with: " + p1 + " " + p2 + " [v2]"; },
		fnParam: function(p1, p2){ return p1 === "p1.p1" && p2 === "p2.p2" ? "fn value [v2]" : undefined; },
		checked: function() { return "checked"; },
		hideFn: function(){ return true; },
		showFn: function(){ return true; },
		deep: {
			fn1: function(){ return "fn deep string returned [v2]"; }
		}
	},
	cl:"myClass",
	cl2:"myClass2",
	checked: "checked",
	items: [{name:"zero [v2]", deep:{other:"1 [v2]"}}, {name:"one [v2]", deep:{other:"2 [v2]"}}, {name:"two [v2]", deep:{other:"3 [v2]"}}],
	arr:["zero [v2]", "one [v2]", "two [v2]"],
	obj: {
		title: "object containing arrays",
		data: [1, 2, 3]
	},
	l0: [
		[
			["0-0-1 [v2]", "0-0-1 [v2]", "0-0-2 [v2]"],
			["0-1-1 [v2]", "0-1-1 [v2]", "0-1-2 [v2]"],
			["0-2-1 [v2]", "0-2-1 [v2]", "0-2-2 [v2]"]
		],
		[
			["1-0-1 [v2]", "1-0-1 [v2]", "1-0-2 [v2]"],
			["1-1-1 [v2]", "1-1-1 [v2]", "1-1-2 [v2]"],
			["1-2-1 [v2]", "1-2-1 [v2]", "1-2-2 [v2]"]
		],
		[
			["2-0-1 [v2]", "2-0-1 [v2]", "2-0-2 [v2]"],
			["2-1-1 [v2]", "2-1-1 [v2]", "2-1-2 [v2]"],
			["2-2-1 [v2]", "2-2-1 [v2]", "2-2-2 [v2]"]
		]
	]
};

var obj;

var template = new soma.Template(document.getElementById('ct'));

function compile() {
	obj = obj === obj1 ? obj2 : obj1;
	var time = new Date().getTime();
	template.compile(obj);
	$('.time').html("Time elapsed: " + (new Date().getTime() - time) + " ms");
}

compile();

$('.switch').click(compile);
$('.switchtouch').bind('touchstart', function() {
	compile();
});

// string
new soma.Template('<p>{{name}}</p>')
	.target(document.getElementById('target'))
	.compile({name:"John"});
