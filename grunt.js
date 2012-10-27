module.exports = function(grunt) {
	grunt.initConfig({
		pkg:'<json:package.json>',
		meta:{
			version:'<%=pkg.version%>',
			banner:'/*! soma-template - v<%= meta.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'* http://www.soundstep.com/\n' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
				'Soundstep */'
		},
		min:{
			dest:{
				src:['<banner:meta.banner>', 'src/soma-template-old.js'],
				dest:'build/soma-template-v<%= meta.version %>.min.js'
			}
		},
		watch:{
			scripts:{
				files:[
					'src/*.js',
					'grunt.js'
				],
				tasks:'min'
			}
		}
	});

	grunt.registerTask('default', 'min');
}
