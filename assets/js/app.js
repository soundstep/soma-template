;(function(ns, undefined) {

	var clicked = false;

    $('nav > ul > li').click(function() {
	    clicked = true;
	    $('nav > ul > li > ul').addClass('hidden');
	    $('ul', $(this)).removeClass('hidden');
    });

	$(window).scroll(function() {
		// vars
		var heightWindow = $(window).height();
		var position = $(document).scrollTop();
		var elements = $('a[name]');
		var current;
		// reset
		$('nav a').removeClass('current');
		if (!clicked) $('nav > ul > li > ul').addClass('hidden');
		// loop
		var i = elements.length, l = 0;
		while (--i >= 0) {
			if (position > $(elements[i]).offset().top - 150) {
				current = $(elements[i]);
				break;
			}
		}
		// assign
		var currentName = current.attr('name');
		var a = $('nav li a[href="#' + currentName + '"]');
		a.parents('ul').removeClass('hidden');
		a.addClass('current');
		clicked = false;
	});

})(this['ns'] = this['ns'] || {});
