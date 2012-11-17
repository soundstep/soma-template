describe("api - variables", function () {

	beforeEach(function () {
		createContainer();
		createTemplate();
	});

	afterEach(function () {
		disposeTemplate();
		disposeContainer();
	});

	it("index in text node", function () {
		ct.innerHTML =
			'<div data-repeat="itemA in itemsA">{{$index}}' +
				'<div data-repeat="itemB in itemsB">{{$index}}</div>' +
			'</div>';
		tpl.compile();
		tpl.scope.itemsA = ["itemA1", "itemA2", "itemA3"];
		tpl.scope.itemsB = ["itemB1", "itemB2", "itemB3"];
		tpl.render();
		// first repeat
		expect(ct.childNodes[0].firstChild.nodeValue).toEqual('0');
		expect(ct.childNodes[1].firstChild.nodeValue).toEqual('1');
		expect(ct.childNodes[2].firstChild.nodeValue).toEqual('2');
		// second repeat
		expect(ct.childNodes[0].childNodes[1].firstChild.nodeValue).toEqual('0');
		expect(ct.childNodes[0].childNodes[2].firstChild.nodeValue).toEqual('1');
		expect(ct.childNodes[0].childNodes[3].firstChild.nodeValue).toEqual('2');
		expect(ct.childNodes[1].childNodes[1].firstChild.nodeValue).toEqual('0');
		expect(ct.childNodes[1].childNodes[2].firstChild.nodeValue).toEqual('1');
		expect(ct.childNodes[1].childNodes[3].firstChild.nodeValue).toEqual('2');
		expect(ct.childNodes[2].childNodes[1].firstChild.nodeValue).toEqual('0');
		expect(ct.childNodes[2].childNodes[2].firstChild.nodeValue).toEqual('1');
		expect(ct.childNodes[2].childNodes[3].firstChild.nodeValue).toEqual('2');
	});

	it("index in attribute", function () {
		ct.innerHTML =
			'<div data-repeat="itemA in itemsA" data-id="myClassA{{$index}}">' +
				'<div data-repeat="itemB in itemsB" data-id="myClassB{{$index}}"></div>' +
			'</div>';
		tpl.compile();
		tpl.scope.itemsA = ["itemA1", "itemA2", "itemA3"];
		tpl.scope.itemsB = ["itemB1", "itemB2", "itemB3"];
		tpl.render();
		// first repeat
		expect(ct.childNodes[0].getAttribute('data-id')).toEqual('myClassA0');
		expect(ct.childNodes[1].getAttribute('data-id')).toEqual('myClassA1');
		expect(ct.childNodes[2].getAttribute('data-id')).toEqual('myClassA2');
		// second repeat
		expect(ct.childNodes[0].childNodes[0].getAttribute('data-id')).toEqual('myClassB0');
		expect(ct.childNodes[0].childNodes[1].getAttribute('data-id')).toEqual('myClassB1');
		expect(ct.childNodes[0].childNodes[2].getAttribute('data-id')).toEqual('myClassB2');
		expect(ct.childNodes[1].childNodes[0].getAttribute('data-id')).toEqual('myClassB0');
		expect(ct.childNodes[1].childNodes[1].getAttribute('data-id')).toEqual('myClassB1');
		expect(ct.childNodes[1].childNodes[2].getAttribute('data-id')).toEqual('myClassB2');
		expect(ct.childNodes[2].childNodes[0].getAttribute('data-id')).toEqual('myClassB0');
		expect(ct.childNodes[2].childNodes[1].getAttribute('data-id')).toEqual('myClassB1');
		expect(ct.childNodes[2].childNodes[2].getAttribute('data-id')).toEqual('myClassB2');
	});

	it("index parent", function () {
		ct.innerHTML =
			'<div data-repeat="itemA in itemsA">{{$index}}' +
				'<div data-repeat="itemB in itemsB">{{../$index}}</div>' +
			'</div>';
		tpl.compile();
		tpl.scope.itemsA = ["itemA1", "itemA2", "itemA3"];
		tpl.scope.itemsB = ["itemB1", "itemB2", "itemB3"];
		tpl.render();
		// first repeat
		expect(ct.childNodes[0].firstChild.nodeValue).toEqual('0');
		expect(ct.childNodes[1].firstChild.nodeValue).toEqual('1');
		expect(ct.childNodes[2].firstChild.nodeValue).toEqual('2');
		// second repeat
		expect(ct.childNodes[0].childNodes[1].firstChild.nodeValue).toEqual('0');
		expect(ct.childNodes[0].childNodes[2].firstChild.nodeValue).toEqual('0');
		expect(ct.childNodes[0].childNodes[3].firstChild.nodeValue).toEqual('0');
		expect(ct.childNodes[1].childNodes[1].firstChild.nodeValue).toEqual('1');
		expect(ct.childNodes[1].childNodes[2].firstChild.nodeValue).toEqual('1');
		expect(ct.childNodes[1].childNodes[3].firstChild.nodeValue).toEqual('1');
		expect(ct.childNodes[2].childNodes[1].firstChild.nodeValue).toEqual('2');
		expect(ct.childNodes[2].childNodes[2].firstChild.nodeValue).toEqual('2');
		expect(ct.childNodes[2].childNodes[3].firstChild.nodeValue).toEqual('2');
	});

	it("index as parameter", function () {
		ct.innerHTML =
			'<div data-repeat="itemA in itemsA">{{processA($index)}}' +
				'<div data-repeat="itemB in itemsB">{{processB($index)}}</div>' +
			'</div>';
		tpl.compile();
		tpl.scope.itemsA = ["itemA1", "itemA2", "itemA3"];
		tpl.scope.itemsB = ["itemB1", "itemB2", "itemB3"];
		tpl.scope.processA = function(index) {
			return "processedA" + index;
		}
		tpl.scope.processB = function(index) {
			return "processedB" + index;
		}
		tpl.render();
		// first repeat
		expect(ct.childNodes[0].firstChild.nodeValue).toEqual('processedA0');
		expect(ct.childNodes[1].firstChild.nodeValue).toEqual('processedA1');
		expect(ct.childNodes[2].firstChild.nodeValue).toEqual('processedA2');
		// second repeat
		expect(ct.childNodes[0].childNodes[1].firstChild.nodeValue).toEqual('processedB0');
		expect(ct.childNodes[0].childNodes[2].firstChild.nodeValue).toEqual('processedB1');
		expect(ct.childNodes[0].childNodes[3].firstChild.nodeValue).toEqual('processedB2');
		expect(ct.childNodes[1].childNodes[1].firstChild.nodeValue).toEqual('processedB0');
		expect(ct.childNodes[1].childNodes[2].firstChild.nodeValue).toEqual('processedB1');
		expect(ct.childNodes[1].childNodes[3].firstChild.nodeValue).toEqual('processedB2');
		expect(ct.childNodes[2].childNodes[1].firstChild.nodeValue).toEqual('processedB0');
		expect(ct.childNodes[2].childNodes[2].firstChild.nodeValue).toEqual('processedB1');
		expect(ct.childNodes[2].childNodes[3].firstChild.nodeValue).toEqual('processedB2');
	});

	it("index parent as parameter", function () {
		ct.innerHTML =
			'<div data-repeat="itemA in itemsA">{{processA($index)}}' +
				'<div data-repeat="itemB in itemsB">{{../processA(../$index)}}</div>' +
			'</div>';
		tpl.compile();
		tpl.scope.itemsA = ["itemA1", "itemA2", "itemA3"];
		tpl.scope.itemsB = ["itemB1", "itemB2", "itemB3"];
		tpl.scope.processA = function(index) {
			return "processedA" + index;
		}
		tpl.scope.processB = function(index) {
			return "processedB" + index;
		}
		tpl.render();
		// first repeat
		expect(ct.childNodes[0].firstChild.nodeValue).toEqual('processedA0');
		expect(ct.childNodes[1].firstChild.nodeValue).toEqual('processedA1');
		expect(ct.childNodes[2].firstChild.nodeValue).toEqual('processedA2');
		// second repeat
		expect(ct.childNodes[0].childNodes[1].firstChild.nodeValue).toEqual('processedA0');
		expect(ct.childNodes[0].childNodes[2].firstChild.nodeValue).toEqual('processedA0');
		expect(ct.childNodes[0].childNodes[3].firstChild.nodeValue).toEqual('processedA0');
		expect(ct.childNodes[1].childNodes[1].firstChild.nodeValue).toEqual('processedA1');
		expect(ct.childNodes[1].childNodes[2].firstChild.nodeValue).toEqual('processedA1');
		expect(ct.childNodes[1].childNodes[3].firstChild.nodeValue).toEqual('processedA1');
		expect(ct.childNodes[2].childNodes[1].firstChild.nodeValue).toEqual('processedA2');
		expect(ct.childNodes[2].childNodes[2].firstChild.nodeValue).toEqual('processedA2');
		expect(ct.childNodes[2].childNodes[3].firstChild.nodeValue).toEqual('processedA2');
	});

	it("key in text node", function () {
		ct.innerHTML =
			'<div data-repeat="itemA in itemsA">{{$key}}' +
				'<div data-repeat="itemB in itemsB">{{$key}}</div>' +
				'</div>';
		tpl.compile();
		tpl.scope.itemsA = {itemA1:"itemA1 value", itemA2:"itemA2 value", itemA3:"itemA3 value"};
		tpl.scope.itemsB = {itemB1:"itemB1 value", itemB2:"itemB2 value", itemB3:"itemB3 value"};
		tpl.render();
		// first repeat
		expect(ct.childNodes[0].firstChild.nodeValue).toEqual('itemA1');
		expect(ct.childNodes[1].firstChild.nodeValue).toEqual('itemA2');
		expect(ct.childNodes[2].firstChild.nodeValue).toEqual('itemA3');
		// second repeat
		expect(ct.childNodes[0].childNodes[1].firstChild.nodeValue).toEqual('itemB1');
		expect(ct.childNodes[0].childNodes[2].firstChild.nodeValue).toEqual('itemB2');
		expect(ct.childNodes[0].childNodes[3].firstChild.nodeValue).toEqual('itemB3');
		expect(ct.childNodes[1].childNodes[1].firstChild.nodeValue).toEqual('itemB1');
		expect(ct.childNodes[1].childNodes[2].firstChild.nodeValue).toEqual('itemB2');
		expect(ct.childNodes[1].childNodes[3].firstChild.nodeValue).toEqual('itemB3');
		expect(ct.childNodes[2].childNodes[1].firstChild.nodeValue).toEqual('itemB1');
		expect(ct.childNodes[2].childNodes[2].firstChild.nodeValue).toEqual('itemB2');
		expect(ct.childNodes[2].childNodes[3].firstChild.nodeValue).toEqual('itemB3');
	});

	it("key in attribute", function () {
		ct.innerHTML =
			'<div data-repeat="itemA in itemsA" data-id="myClassA{{$key}}">' +
				'<div data-repeat="itemB in itemsB" data-id="myClassB{{$key}}"></div>' +
			'</div>';
		tpl.compile();
		tpl.scope.itemsA = {itemA1:"itemA1 value", itemA2:"itemA2 value", itemA3:"itemA3 value"};
		tpl.scope.itemsB = {itemB1:"itemB1 value", itemB2:"itemB2 value", itemB3:"itemB3 value"};
		tpl.render();
		// first repeat
		expect(ct.childNodes[0].getAttribute('data-id')).toEqual('myClassAitemA1');
		expect(ct.childNodes[1].getAttribute('data-id')).toEqual('myClassAitemA2');
		expect(ct.childNodes[2].getAttribute('data-id')).toEqual('myClassAitemA3');
		// second repeat
		expect(ct.childNodes[0].childNodes[0].getAttribute('data-id')).toEqual('myClassBitemB1');
		expect(ct.childNodes[0].childNodes[1].getAttribute('data-id')).toEqual('myClassBitemB2');
		expect(ct.childNodes[0].childNodes[2].getAttribute('data-id')).toEqual('myClassBitemB3');
		expect(ct.childNodes[1].childNodes[0].getAttribute('data-id')).toEqual('myClassBitemB1');
		expect(ct.childNodes[1].childNodes[1].getAttribute('data-id')).toEqual('myClassBitemB2');
		expect(ct.childNodes[1].childNodes[2].getAttribute('data-id')).toEqual('myClassBitemB3');
		expect(ct.childNodes[2].childNodes[0].getAttribute('data-id')).toEqual('myClassBitemB1');
		expect(ct.childNodes[2].childNodes[1].getAttribute('data-id')).toEqual('myClassBitemB2');
		expect(ct.childNodes[2].childNodes[2].getAttribute('data-id')).toEqual('myClassBitemB3');
	});

	it("key parent", function () {
		ct.innerHTML =
			'<div data-repeat="itemA in itemsA" data-id="myClassA{{$key}}">' +
				'<div data-repeat="itemB in itemsB" data-id="myClassB{{../$key}}"></div>' +
			'</div>';
		tpl.compile();
		tpl.scope.itemsA = {itemA1:"itemA1 value", itemA2:"itemA2 value", itemA3:"itemA3 value"};
		tpl.scope.itemsB = {itemB1:"itemB1 value", itemB2:"itemB2 value", itemB3:"itemB3 value"};
		tpl.render();
		// first repeat
		expect(ct.childNodes[0].getAttribute('data-id')).toEqual('myClassAitemA1');
		expect(ct.childNodes[1].getAttribute('data-id')).toEqual('myClassAitemA2');
		expect(ct.childNodes[2].getAttribute('data-id')).toEqual('myClassAitemA3');
		// second repeat
		expect(ct.childNodes[0].childNodes[0].getAttribute('data-id')).toEqual('myClassBitemA1');
		expect(ct.childNodes[0].childNodes[1].getAttribute('data-id')).toEqual('myClassBitemA1');
		expect(ct.childNodes[0].childNodes[2].getAttribute('data-id')).toEqual('myClassBitemA1');
		expect(ct.childNodes[1].childNodes[0].getAttribute('data-id')).toEqual('myClassBitemA2');
		expect(ct.childNodes[1].childNodes[1].getAttribute('data-id')).toEqual('myClassBitemA2');
		expect(ct.childNodes[1].childNodes[2].getAttribute('data-id')).toEqual('myClassBitemA2');
		expect(ct.childNodes[2].childNodes[0].getAttribute('data-id')).toEqual('myClassBitemA3');
		expect(ct.childNodes[2].childNodes[1].getAttribute('data-id')).toEqual('myClassBitemA3');
		expect(ct.childNodes[2].childNodes[2].getAttribute('data-id')).toEqual('myClassBitemA3');
	});

	it("key as parameter", function () {
		ct.innerHTML =
			'<div data-repeat="itemA in itemsA">{{processA($key)}}' +
				'<div data-repeat="itemB in itemsB">{{processB($key)}}</div>' +
			'</div>';
		tpl.compile();
		tpl.scope.itemsA = {itemA1:"itemA1 value", itemA2:"itemA2 value", itemA3:"itemA3 value"};
		tpl.scope.itemsB = {itemB1:"itemB1 value", itemB2:"itemB2 value", itemB3:"itemB3 value"};
		tpl.scope.processA = function(index) {
			return "processedA" + index;
		}
		tpl.scope.processB = function(index) {
			return "processedB" + index;
		}
		tpl.render();
		// first repeat
		expect(ct.childNodes[0].firstChild.nodeValue).toEqual('processedAitemA1');
		expect(ct.childNodes[1].firstChild.nodeValue).toEqual('processedAitemA2');
		expect(ct.childNodes[2].firstChild.nodeValue).toEqual('processedAitemA3');
		// second repeat
		expect(ct.childNodes[0].childNodes[1].firstChild.nodeValue).toEqual('processedBitemB1');
		expect(ct.childNodes[0].childNodes[2].firstChild.nodeValue).toEqual('processedBitemB2');
		expect(ct.childNodes[0].childNodes[3].firstChild.nodeValue).toEqual('processedBitemB3');
		expect(ct.childNodes[1].childNodes[1].firstChild.nodeValue).toEqual('processedBitemB1');
		expect(ct.childNodes[1].childNodes[2].firstChild.nodeValue).toEqual('processedBitemB2');
		expect(ct.childNodes[1].childNodes[3].firstChild.nodeValue).toEqual('processedBitemB3');
		expect(ct.childNodes[2].childNodes[1].firstChild.nodeValue).toEqual('processedBitemB1');
		expect(ct.childNodes[2].childNodes[2].firstChild.nodeValue).toEqual('processedBitemB2');
		expect(ct.childNodes[2].childNodes[3].firstChild.nodeValue).toEqual('processedBitemB3');
	});

	it("key parent as parameter", function () {
		ct.innerHTML =
			'<div data-repeat="itemA in itemsA">{{processA($key)}}' +
				'<div data-repeat="itemB in itemsB">{{../processA(../$key)}}</div>' +
			'</div>';
		tpl.compile();
		tpl.scope.itemsA = {itemA1:"itemA1 value", itemA2:"itemA2 value", itemA3:"itemA3 value"};
		tpl.scope.itemsB = {itemB1:"itemB1 value", itemB2:"itemB2 value", itemB3:"itemB3 value"};
		tpl.scope.processA = function(index) {
			return "processedA" + index;
		}
		tpl.scope.processB = function(index) {
			return "processedB" + index;
		}
		tpl.render();
		// first repeat
		expect(ct.childNodes[0].firstChild.nodeValue).toEqual('processedAitemA1');
		expect(ct.childNodes[1].firstChild.nodeValue).toEqual('processedAitemA2');
		expect(ct.childNodes[2].firstChild.nodeValue).toEqual('processedAitemA3');
		// second repeat
		expect(ct.childNodes[0].childNodes[1].firstChild.nodeValue).toEqual('processedAitemA1');
		expect(ct.childNodes[0].childNodes[2].firstChild.nodeValue).toEqual('processedAitemA1');
		expect(ct.childNodes[0].childNodes[3].firstChild.nodeValue).toEqual('processedAitemA1');
		expect(ct.childNodes[1].childNodes[1].firstChild.nodeValue).toEqual('processedAitemA2');
		expect(ct.childNodes[1].childNodes[2].firstChild.nodeValue).toEqual('processedAitemA2');
		expect(ct.childNodes[1].childNodes[3].firstChild.nodeValue).toEqual('processedAitemA2');
		expect(ct.childNodes[2].childNodes[1].firstChild.nodeValue).toEqual('processedAitemA3');
		expect(ct.childNodes[2].childNodes[2].firstChild.nodeValue).toEqual('processedAitemA3');
		expect(ct.childNodes[2].childNodes[3].firstChild.nodeValue).toEqual('processedAitemA3');
	});

});
