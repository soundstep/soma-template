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