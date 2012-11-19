;(function(ns, undefined) {

    $('nav > ul > li').click(function() {
	    $('nav > ul > li > ul').hide();
	    $('ul', $(this)).show();
    });

})(this['ns'] = this['ns'] || {});