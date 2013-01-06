if (!Function.prototype.bind) {
	Function.prototype.bind = function bind(that) {
		var target = this;
		if (typeof target != "function") {
			throw new Error("Error, you must bind a function.");
		}
		var args = Array.prototype.slice.call(arguments, 1); // for normal call
		var bound = function () {
			if (this instanceof bound) {
				var F = function(){};
				F.prototype = target.prototype;
				var self = new F;
				var result = target.apply(
					self,
					args.concat(Array.prototype.slice.call(arguments))
				);
				if (Object(result) === result) {
					return result;
				}
				return self;
			} else {
				return target.apply(
					that,
					args.concat(Array.prototype.slice.call(arguments))
				);
			}
		};
		return bound;
	};
}
if (!('trim' in String.prototype)) {
	String.prototype.trim= function() {
		return this.replace(/^\s+/, '').replace(/\s+$/, '');
	};
}
if (!('indexOf' in Array.prototype)) {
	Array.prototype.indexOf= function(find, i /*opt*/) {
		if (i===undefined) i= 0;
		if (i<0) i+= this.length;
		if (i<0) i= 0;
		for (var n= this.length; i<n; i++)
			if (i in this && this[i]===find)
				return i;
		return -1;
	};
}
if (!('lastIndexOf' in Array.prototype)) {
	Array.prototype.lastIndexOf= function(find, i /*opt*/) {
		if (i===undefined) i= this.length-1;
		if (i<0) i+= this.length;
		if (i>this.length-1) i= this.length-1;
		for (i++; i-->0;) /* i++ because from-argument is sadly inclusive */
			if (i in this && this[i]===find)
				return i;
		return -1;
	};
}
if (!('forEach' in Array.prototype)) {
	Array.prototype.forEach= function(action, that /*opt*/) {
		for (var i= 0, n= this.length; i<n; i++)
			if (i in this)
				action.call(that, this[i], i, this);
	};
}
if (!('map' in Array.prototype)) {
	Array.prototype.map= function(mapper, that /*opt*/) {
		var other= new Array(this.length);
		for (var i= 0, n= this.length; i<n; i++)
			if (i in this)
				other[i]= mapper.call(that, this[i], i, this);
		return other;
	};
}
if (!('filter' in Array.prototype)) {
	Array.prototype.filter= function(filter, that /*opt*/) {
		var other= [], v;
		for (var i=0, n= this.length; i<n; i++)
			if (i in this && filter.call(that, v= this[i], i, this))
				other.push(v);
		return other;
	};
}
if (!('every' in Array.prototype)) {
	Array.prototype.every= function(tester, that /*opt*/) {
		for (var i= 0, n= this.length; i<n; i++)
			if (i in this && !tester.call(that, this[i], i, this))
				return false;
		return true;
	};
}
if (!('some' in Array.prototype)) {
	Array.prototype.some= function(tester, that /*opt*/) {
		for (var i= 0, n= this.length; i<n; i++)
			if (i in this && tester.call(that, this[i], i, this))
				return true;
		return false;
	};
}