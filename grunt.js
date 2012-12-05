module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-shell');

	grunt.initConfig({
		pkg:'<json:package.json>',
		meta:{
			version:'<%=pkg.version%>',
			banner:'/*! soma-template - v<%= meta.version %> - Romuald Quantin - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'* http://soundstep.github.com/soma-template/\n' +
				'* MIT licence <%= grunt.template.today("yyyy") %> ' +
				'*/'
		},
		concat: {
			dist: {
				src: [
					'src/1.prefix.js',
					'src/2.settings.js',
					'src/3.helpers.js',
					'src/4.shared.js',
					'src/5.scope.js',
					'src/6.node.js',
					'src/7.attribute.js',
					'src/8.interpolation.js',
					'src/9.expression.js',
					'src/10.template.js',
					'src/11.events.js',
					'src/12.bootstrap.js',
					'src/13.export.js',
					'src/14.suffix.js'
				],
				dest: 'build/soma-template.js'
			}
		},
		min:{
			dest:{
				src:['<banner:meta.banner>', 'build/soma-template.js'],
				dest:'build/soma-template-v<%= meta.version %>.min.js'
			}
		},
		watch:{
			scripts:{
				files:[
					'src/*.js',
					'grunt.js'
				],
				tasks:'concat min'
			}
		}
	});

	grunt.registerTask('default', 'concat min');
}
