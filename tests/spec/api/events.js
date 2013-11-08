describe("api - events", function () {

	beforeEach(function () {
		createContainer();
		createTemplate();
	});

	afterEach(function () {
		disposeTemplate();
		disposeContainer();
	});

	it("parse event", function () {
		ct.innerHTML = '<button id="bt1" data-click="clickHandler()">click</button><button id="bt2" data-mouseover="overHandler()">over</button>';
		tpl.compile();
		tpl.render();
		tpl.scope.clickHandler = function(){alert(1)};
		tpl.scope.overHandler = function(){alert(2)};
		spyOn(tpl.scope, 'clickHandler');
		spyOn(tpl.scope, 'overHandler');
		simulate(document.getElementById('bt1'), 'click');
		simulate(document.getElementById('bt2'), 'mouseover');
		expect(tpl.scope.clickHandler).toHaveBeenCalled();
		expect(tpl.scope.clickHandler.mostRecentCall.args[0].type).toEqual('click');
		expect(tpl.scope.overHandler).toHaveBeenCalled();
		expect(tpl.scope.overHandler.mostRecentCall.args[0].type).toEqual('mouseover');
	});

	it("clear events", function () {
		ct.innerHTML = '<button id="bt1" data-click="clickHandler()">click</button><button id="bt2" data-mouseover="overHandler()">over</button>';
		tpl.compile();
		tpl.render();
		tpl.scope.clickHandler = function(){};
		tpl.scope.overHandler = function(){};
		tpl.clearEvents();
		spyOn(tpl.scope, 'clickHandler');
		spyOn(tpl.scope, 'overHandler');
		simulate(document.getElementById('bt1'), 'click');
		simulate(document.getElementById('bt2'), 'mouseover');
		expect(tpl.scope.clickHandler).not.toHaveBeenCalled();
		expect(tpl.scope.overHandler).not.toHaveBeenCalled();
	});

	it("parse event with param", function () {
		ct.innerHTML = '<button id="bt1" data-click="clickHandler(name)">click</button><button id="bt2" data-mouseover="overHandler(age)">over</button>';
		tpl.compile();
		tpl.render();
		tpl.scope.name = 'john';
		tpl.scope.age = 21;
		tpl.scope.clickHandler = function(event, name){ return name; };
		tpl.scope.overHandler = function(event, age){ return age; };
		spyOn(tpl.scope, 'clickHandler');
		spyOn(tpl.scope, 'overHandler');
		simulate(document.getElementById('bt1'), 'click');
		simulate(document.getElementById('bt2'), 'mouseover');
		expect(tpl.scope.clickHandler).toHaveBeenCalled();
		expect(tpl.scope.clickHandler.mostRecentCall.args[0].type).toEqual('click');
		expect(tpl.scope.clickHandler.mostRecentCall.args[1]).toEqual(tpl.scope.name);
		expect(tpl.scope.overHandler).toHaveBeenCalled();
		expect(tpl.scope.overHandler.mostRecentCall.args[0].type).toEqual('mouseover');
		expect(tpl.scope.overHandler.mostRecentCall.args[1]).toEqual(tpl.scope.age);
	});

	it("manual event on scope", function () {
		var clickCalled = false;
		var overCalled = false;
		ct.innerHTML = '<button id="bt1">click</button><button id="bt2">over</button>';
		tpl.compile();
		tpl.render();
		tpl.scope.clickHandler = function(){ clickCalled = true; };
		tpl.scope.overHandler = function(){ overCalled = true; };
		soma.template.addEvent(document.getElementById('bt1'), 'click', tpl.scope.clickHandler);
		soma.template.addEvent(document.getElementById('bt2'), 'mouseover', tpl.scope.overHandler);
		simulate(document.getElementById('bt1'), 'click');
		simulate(document.getElementById('bt2'), 'mouseover');
		expect(clickCalled).toBeTruthy();
		expect(overCalled).toBeTruthy();
	});

	it("clear manual event on scope", function () {
		var clickCalled = false;
		var overCalled = false;
		ct.innerHTML = '<button id="bt1">click</button><button id="bt2">over</button>';
		tpl.compile();
		tpl.render();
		tpl.scope.clickHandler = function(){ clickCalled = true; };
		tpl.scope.overHandler = function(){ overCalled = true; };
		soma.template.addEvent(document.getElementById('bt1'), 'click', tpl.scope.clickHandler);
		soma.template.addEvent(document.getElementById('bt2'), 'mouseover', tpl.scope.overHandler);
		soma.template.removeEvent(document.getElementById('bt1'), 'click', tpl.scope.clickHandler);
		soma.template.removeEvent(document.getElementById('bt2'), 'mouseover', tpl.scope.overHandler);
		simulate(document.getElementById('bt1'), 'click');
		simulate(document.getElementById('bt2'), 'mouseover');
		expect(clickCalled).toBeFalsy();
		expect(overCalled).toBeFalsy();
	});

	it("manual event on function", function () {
		var clickCalled = false;
		var overCalled = false;
		ct.innerHTML = '<button id="bt1">click</button><button id="bt2">over</button>';
		tpl.compile();
		tpl.render();
		var clickHandler = function(){ clickCalled = true; };
		var overHandler = function(){ overCalled = true; };
		soma.template.addEvent(document.getElementById('bt1'), 'click', clickHandler);
		soma.template.addEvent(document.getElementById('bt2'), 'mouseover', overHandler);
		simulate(document.getElementById('bt1'), 'click');
		simulate(document.getElementById('bt2'), 'mouseover');
		expect(clickCalled).toBeTruthy();
		expect(overCalled).toBeTruthy();
	});

	it("clear manual event on function", function () {
		var clickCalled = false;
		var overCalled = false;
		ct.innerHTML = '<button id="bt1">click</button><button id="bt2">over</button>';
		tpl.compile();
		tpl.render();
		var clickHandler = function(){ clickCalled = true; };
		var overHandler = function(){ overCalled = true; };
		soma.template.addEvent(document.getElementById('bt1'), 'click', clickHandler);
		soma.template.addEvent(document.getElementById('bt2'), 'mouseover', overHandler);
		soma.template.removeEvent(document.getElementById('bt1'), 'click', clickHandler);
		soma.template.removeEvent(document.getElementById('bt2'), 'mouseover', overHandler);
		simulate(document.getElementById('bt1'), 'click');
		simulate(document.getElementById('bt2'), 'mouseover');
		expect(clickCalled).toBeFalsy();
		expect(overCalled).toBeFalsy();
	});

	it("node event", function () {
		ct.innerHTML = '<button id="bt1">click</button><button id="bt2">over</button>';
		tpl.compile();
		tpl.render();
		tpl.scope.clickHandler = function(){};
		tpl.scope.clickHandler2 = function(){};
		tpl.scope.overHandler = function(){};
		tpl.getNode(document.getElementById('bt1')).addEvent('click', 'clickHandler()');
		tpl.getNode(document.getElementById('bt2')).addEvent('mouseover', 'overHandler()');
		spyOn(tpl.scope, 'clickHandler');
		spyOn(tpl.scope, 'overHandler');
		simulate(document.getElementById('bt1'), 'click');
		simulate(document.getElementById('bt2'), 'mouseover');
		expect(tpl.scope.clickHandler).toHaveBeenCalled();
		expect(tpl.scope.clickHandler.mostRecentCall.args[0].type).toEqual('click');
		expect(tpl.scope.overHandler).toHaveBeenCalled();
		expect(tpl.scope.overHandler.mostRecentCall.args[0].type).toEqual('mouseover');
	});

	it("remove node event", function () {
		ct.innerHTML = '<button id="bt1">click</button><button id="bt2">over</button>';
		tpl.compile();
		tpl.render();
		tpl.scope.clickHandler = function(){};
		tpl.scope.overHandler = function(){};
		tpl.getNode(document.getElementById('bt1')).addEvent('click', 'clickHandler()');
		tpl.getNode(document.getElementById('bt2')).addEvent('mouseover', 'overHandler()');
		tpl.getNode(document.getElementById('bt1')).removeEvent('click', 'clickHandler()');
		tpl.getNode(document.getElementById('bt2')).removeEvent('mouseover', 'overHandler()');
		spyOn(tpl.scope, 'clickHandler');
		spyOn(tpl.scope, 'overHandler');
		simulate(document.getElementById('bt1'), 'click');
		simulate(document.getElementById('bt2'), 'mouseover');
		expect(tpl.scope.clickHandler).not.toHaveBeenCalled();
		expect(tpl.scope.overHandler).not.toHaveBeenCalled();
	});

	it("node event with param", function () {
		ct.innerHTML = '<button id="bt1">click</button><button id="bt2">over</button>';
		tpl.compile();
		tpl.render();
		tpl.scope.name = 'john';
		tpl.scope.age = 21;
		tpl.scope.clickHandler = function(event, name){ return name; };
		tpl.scope.overHandler = function(event, age){ return age; };
		tpl.getNode(document.getElementById('bt1')).addEvent('click', 'clickHandler(name)');
		tpl.getNode(document.getElementById('bt2')).addEvent('mouseover', 'overHandler(age)');
		spyOn(tpl.scope, 'clickHandler');
		spyOn(tpl.scope, 'overHandler');
		simulate(document.getElementById('bt1'), 'click');
		simulate(document.getElementById('bt2'), 'mouseover');
		expect(tpl.scope.clickHandler).toHaveBeenCalled();
		expect(tpl.scope.clickHandler.mostRecentCall.args[0].type).toEqual('click');
		expect(tpl.scope.clickHandler.mostRecentCall.args[1]).toEqual(tpl.scope.name);
		expect(tpl.scope.overHandler).toHaveBeenCalled();
		expect(tpl.scope.overHandler.mostRecentCall.args[0].type).toEqual('mouseover');
		expect(tpl.scope.overHandler.mostRecentCall.args[1]).toEqual(tpl.scope.age);
	});

	it("remove node event with param", function () {
		ct.innerHTML = '<button id="bt1">click</button><button id="bt2">over</button>';
		tpl.compile();
		tpl.render();
		tpl.scope.name = 'john';
		tpl.scope.age = 21;
		tpl.scope.clickHandler = function(event, name){ return name; };
		tpl.scope.overHandler = function(event, age){ return age; };
		tpl.getNode(document.getElementById('bt1')).addEvent('click', 'clickHandler(name)');
		tpl.getNode(document.getElementById('bt2')).addEvent('mouseover', 'overHandler(age)');
		tpl.getNode(document.getElementById('bt1')).removeEvent('click', 'clickHandler(name)');
		tpl.getNode(document.getElementById('bt2')).removeEvent('mouseover', 'overHandler(age)');
		spyOn(tpl.scope, 'clickHandler');
		spyOn(tpl.scope, 'overHandler');
		simulate(document.getElementById('bt1'), 'click');
		simulate(document.getElementById('bt2'), 'mouseover');
		expect(tpl.scope.clickHandler).not.toHaveBeenCalled();
		expect(tpl.scope.overHandler).not.toHaveBeenCalled();
	});

	it("in repeater", function () {
		ct.innerHTML = '<ul><li data-repeat="item in items" id="li{{$index}}" data-click="clickHandler($index, item)">{{$index}}</li></ul>';
		tpl.compile();
		tpl.scope.items = ['A', 'B', 'C'];
		tpl.scope.clickHandler = function(event, index) {alert(index)};
		tpl.render();
		spyOn(tpl.scope, 'clickHandler');
		simulate(document.getElementById('li0'), 'click');
		simulate(document.getElementById('li1'), 'click');
		simulate(document.getElementById('li2'), 'click');
		expect(tpl.scope.clickHandler).toHaveBeenCalled();
		expect(tpl.scope.clickHandler.callCount).toEqual(3);
		expect(tpl.scope.clickHandler.argsForCall[0][0].type).toEqual('click');
		expect(tpl.scope.clickHandler.argsForCall[0][1]).toEqual(0);
		expect(tpl.scope.clickHandler.argsForCall[0][2]).toEqual('A');
		expect(tpl.scope.clickHandler.argsForCall[1][0].type).toEqual('click');
		expect(tpl.scope.clickHandler.argsForCall[1][1]).toEqual(1);
		expect(tpl.scope.clickHandler.argsForCall[1][2]).toEqual('B');
		expect(tpl.scope.clickHandler.argsForCall[2][0].type).toEqual('click');
		expect(tpl.scope.clickHandler.argsForCall[2][1]).toEqual(2);
		expect(tpl.scope.clickHandler.argsForCall[2][2]).toEqual('C');
	});

	it("dispose events", function () {
		ct.innerHTML = '<button id="bt1" data-click="clickHandler()">click</button><button id="bt2" data-mouseover="overHandler()">over</button>';
		tpl.compile();
		tpl.render();
		tpl.scope.clickHandler = function(){};
		tpl.scope.overHandler = function(){};
		spyOn(tpl.scope, 'clickHandler');
		spyOn(tpl.scope, 'overHandler');
		tpl.dispose();
		simulate(document.getElementById('bt1'), 'click');
		simulate(document.getElementById('bt2'), 'mouseover');
		expect(tpl.scope.clickHandler).not.toHaveBeenCalled();
		expect(tpl.scope.overHandler).not.toHaveBeenCalled();
	});

	it("no template event parsing", function () {
		var clickCalled = false;
		var overCalled = false;
		var div = doc.createElement('div');
		div.innerHTML = '<button id="bt1" data-click="clickHandler()">click</button><button id="bt2" data-mouseover="overHandler()">over</button>';
		document.body.appendChild(div);
		var obj = {
			clickHandler: function(){ clickCalled = true; },
			overHandler: function(){ overCalled = true; }
		};
		soma.template.parseEvents(document, obj);
		spyOn(obj, 'clickHandler');
		spyOn(obj, 'overHandler');
		simulate(document.getElementById('bt1'), 'click');
		simulate(document.getElementById('bt2'), 'mouseover');
		expect(clickCalled).toBeTruthy();
		expect(overCalled).toBeTruthy();
		document.body.removeChild(div);
	});

	it("no template clear event", function () {
		var clickCalled = false;
		var overCalled = false;
		var div = doc.createElement('div');
		div.innerHTML = '<button id="bt1" data-click="clickHandler()">click</button><button id="bt2" data-mouseover="overHandler()">over</button>';
		document.body.appendChild(div);
		var obj = {
			clickHandler: function(){ clickCalled = true; },
			overHandler: function(){ overCalled = true; }
		};
		soma.template.parseEvents(document, obj);
		soma.template.clearEvents(document, obj);
		spyOn(obj, 'clickHandler');
		spyOn(obj, 'overHandler');
		simulate(document.getElementById('bt1'), 'click');
		simulate(document.getElementById('bt2'), 'mouseover');
		expect(clickCalled).toBeFalsy();
		expect(overCalled).toBeFalsy();
		document.body.removeChild(div);
	});

	it("no template event parsing with depth", function () {
		var clickCalled = false;
		var overCalled = false;
		var div = doc.createElement('div');
		div.innerHTML = '<div id="bt1" data-click="clickHandler()">click<div id="bt2" data-mouseover="overHandler()">over</div></div>';
		document.body.appendChild(div);
		var obj = {
			clickHandler: function(){ clickCalled = true; },
			overHandler: function(){ overCalled = true; }
		};
		soma.template.parseEvents(div, obj, 1);
		spyOn(obj, 'clickHandler');
		spyOn(obj, 'overHandler');
		simulate(document.getElementById('bt1'), 'click');
		simulate(document.getElementById('bt2'), 'mouseover');
		expect(clickCalled).toBeTruthy();
		expect(overCalled).toBeFalsy();
		document.body.removeChild(div);
	});

	it("no template event parsing sibling avoided", function () {
		var clickCalled = false;
		var overCalled = false;
		var div = doc.createElement('div');
		div.innerHTML = '<div id="bt1" data-click="clickHandler()">click</div><div id="bt2" data-mouseover="overHandler()">over</div>';
		document.body.appendChild(div);
		var obj = {
			clickHandler: function(){ clickCalled = true; },
			overHandler: function(){ overCalled = true; }
		};
		soma.template.parseEvents(document.getElementById('bt1'), obj);
		spyOn(obj, 'clickHandler');
		spyOn(obj, 'overHandler');
		simulate(document.getElementById('bt1'), 'click');
		simulate(document.getElementById('bt2'), 'mouseover');
		expect(clickCalled).toBeTruthy();
		expect(overCalled).toBeFalsy();
		document.body.removeChild(div);
	});

	it("no template clear event parsing contains", function () {
		var clickCalled = false;
		var overCalled = false;
		var div = doc.createElement('div');
		div.innerHTML = '<div id="bt1" data-click="clickHandler()">click</div><div id="bt2" data-mouseover="overHandler()">over</div>';
		document.body.appendChild(div);
		var obj = {
			clickHandler: function(){ clickCalled = true; },
			overHandler: function(){ overCalled = true; }
		};
		soma.template.parseEvents(document, obj);
		soma.template.clearEvents(document.getElementById('bt2'));
		spyOn(obj, 'clickHandler');
		spyOn(obj, 'overHandler');
		simulate(document.getElementById('bt1'), 'click');
		simulate(document.getElementById('bt2'), 'mouseover');
		expect(clickCalled).toBeTruthy();
		expect(overCalled).toBeFalsy();
		document.body.removeChild(div);
	});

	it("no template clear single event", function () {
		var clickCalled = false;
		var overCalled = false;
		var div = doc.createElement('div');
		div.innerHTML = '<button id="bt1" data-click="clickHandler()">click</button><button id="bt2" data-mouseover="overHandler()">over</button>';
		document.body.appendChild(div);
		var obj = {
			clickHandler: function(){ clickCalled = true; },
			overHandler: function(){ overCalled = true; }
		};
		soma.template.parseEvents(document, obj);
		soma.template.removeEvent(document.getElementById('bt2'), 'mouseover', obj.overHandler);
		spyOn(obj, 'clickHandler');
		spyOn(obj, 'overHandler');
		simulate(document.getElementById('bt1'), 'click');
		simulate(document.getElementById('bt2'), 'mouseover');
		expect(clickCalled).toBeTruthy();
		expect(overCalled).toBeFalsy();
		document.body.removeChild(div);
	});

});
