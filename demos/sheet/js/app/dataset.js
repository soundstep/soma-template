;(function(ns, undefined) {

    var DataSet = function() {

	    var data = {
		    'text-interpolation': [
			    {'greeting': 'Hello soma-template'},
			    {'greeting': 'Hello world'}
		    ],
		    'attribute-value-interpolation': [
			    {'color': 'color1'},
			    {'color': 'color2'}
		    ],
		    'attribute-name-interpolation': [
			    {'class': 'class'},
			    {'class': 'data-anything'}
		    ],
		    'anything-anywhere': [
			    {
				    'name': 'ss',
				    'value': 'co',
				    'text1': 'd',
				    'text2': 'thi',
				    'text3': 'ywhe'
			    },
			    {
				    'name': 'sh',
				    'value': 'nothing',
				    'text1': 'D',
				    'text2': 'THI',
				    'text3': 'YWHE'
			    }
		    ],
		    'text-interpolation-function': [
			    {
				    'greet': function() {
    return 'Hello soma-template';
  }
			    },
			    {
					'greet': function() {
    return 'Hello world';
  }
				}
		    ],
		    'text-interpolation-function-param': [
			    {
				    'who': 'soma-template',
				    'greet': function(greeting, who) {
    return greeting + ' ' + who;
  }
			    },
			    {
				    'who': 'world',
					'greet': function(greeting, who) {
    return greeting + ' ' + who;
  }
				}
		    ],
		    'text-interpolation-path':[
			    {
				    path: {
					    greet: 'Hello',
					    who: 'soma-template',
					    name: function (who) {
      return ' ' + who;
    }
				    }
			    },
			    {
				    path: {
					    greet: 'Hello',
					    who: 'world',
					    name: function (who) {
      return ' ' + who;
    }
				    }
			    }
		    ],
    		    'text-interpolation-array':[
			    {
				    greet: ['Hello', 'soma-template']
			    },
			    {
				    greet: ['Hello', 'world']
			    }
		    ],
		    'data-repeat-array': [
			    {
				    'greet': 'Hello',
				    'items': [
					    { 'name': 'John' },
					    { 'name': 'David' },
					    { 'name': 'Mike' }
				    ]
			    },
			    {
				    'greet': 'Hi',
				    'items': [
					    { 'name': 'Olivia' },
					    { 'name': 'Emily' },
					    { 'name': 'Helen' }
				    ]
			    }
		    ],
		    'data-repeat-object': [
			    {
				    'greet': 'Hello',
				    'items': {
					    'name1': 'John',
					    'name2': 'David',
					    'name3': 'Mike'
				    }
			    },
			    {
				    'greet': 'Hi',
				    'items': {
					    'name1': 'Olivia',
					    'name2': 'Emily',
					    'name3': 'Helen'
				    }
			    }
		    ],
		    'data-repeat-parent-scope': [
			    {
				    'sections': [
					    {
						    'name': 'Male',
						    'items': [ 'John', 'David', 'Mike' ]
					    },
					    {
						    'name': 'Female',
						    'items': [ 'Olivia', 'Emily', 'Helen' ]
					    }
				    ]
			    },
			    {
				    'sections': [
					    {
						    'name': 'Animal',
						    'items': [ 'Dog', 'Cat', 'Mouse' ]
					    },
					    {
						    'name': 'Bird',
						    'items': [ 'Parrot', 'Pigeon', 'Eagle' ]
					    }
				    ]
			    }
		    ],
		    'watch-token': [
			    { 'name': 'John' },
			    { 'name': 'David' }
		    ],
		    'watch-element': [
			    { 'name': 'John' },
			    { 'name': 'David' }
		    ],
		    'data-skip': [
			    { 'name': 'John', 'age': 20 },
			    { 'name': 'David', 'age': 30 }
		    ],
		    'data-src': [
			    { 'image': 'image1.jpg' },
			    { 'image': 'image2.jpg' }
		    ],
		    'data-href': [
			    { 'link': 'www.soundstep.com' },
			    { 'link': 'github.com/soundstep' }
		    ],
		    'data-cloak': [
			    { 'name': 'John', 'age': 20 },
			    { 'name': 'David', 'age': 30 }
		    ],
		    'data-show-hide': [
			    { 'displayed': true },
			    { 'displayed': false }
		    ],
		    'data-checked': [
			    { 'checked': true },
			    { 'checked': false }
		    ],
		    'data-disabled': [
			    { 'disabled': true },
			    { 'disabled': false }
		    ],
		    'data-multiple': [
			    { 'multiple': true },
			    { 'multiple': false }
		    ],
		    'data-readonly': [
			    { 'readonly': true },
			    { 'readonly': false }
		    ],
		    'data-click': [
			    { 'label': 'Click Me', clickMe: function(event, label) {
    alert('You clicked on: ' + label);
  }
			    },
			    { 'label': 'Press here', clickMe: function(event, label) {
    alert('You clicked on: ' + label);
  }
			    }
		    ],
		    'data-mouseover': [
			    { 'rollOverMe': function(event) {
    event.currentTarget.style.backgroundColor = 'red';
  },
  'out': function(event) {
	  event.currentTarget.style.backgroundColor = 'gold';
  }
			    },
			    { 'rollOverMe': function(event) {
    event.currentTarget.style.backgroundColor = 'green';
  },
  'out': function(event) {
	  event.currentTarget.style.backgroundColor = 'gold';
  }
			    }
		    ]
	    };

	    return {
		    getData: function(id, setId) {
				if (data[id]) {
					return data[id][setId];
				}
			    else {
					return undefined;
				}
		    }
	    }
    };

	ns.DataSet = DataSet;

})(this['ns'] = this['ns'] || {});