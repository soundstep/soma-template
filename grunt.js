module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-shell');

	grunt.initConfig({
		pkg:'<json:package.json>',
		shell: {
			update_build_from_master: {
				command: 'git checkout master build',
				stdout: true
			},
			update_demos_from_master: {
				command: 'git checkout master demos',
				stdout: true
			},
			update_src_from_master: {
				command: 'git checkout master src',
				stdout: true
			},
			update_tests_from_master: {
				command: 'git checkout master tests',
				stdout: true
			}
		}
//		meta:{
//			version:'<%=pkg.version%>',
//			banner:'/*! soma-template - v<%= meta.version %> - ' +
//				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
//				'* http://www.soundstep.com/\n' +
//				'* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
//				'Soundstep */'
//		},
//		concat: {
//			dist: {
//				src: [
//					'src/1.prefix.js',
//					'src/2.settings.js',
//					'src/3.helpers.js',
//					'src/4.shared.js',
//					'src/5.scope.js',
//					'src/6.node.js',
//					'src/7.attribute.js',
//					'src/8.interpolation.js',
//					'src/9.expression.js',
//					'src/10.template.js',
//					'src/11.export.js',
//					'src/12.suffix.js'
//				],
//				dest: 'build/soma-template.js'
//			}
//		},
//		min:{
//			dest:{
//				src:['<banner:meta.banner>', 'build/soma-template.js'],
//				dest:'build/soma-template-v<%= meta.version %>.min.js'
//			}
//		},
//		watch:{
//			scripts:{
//				files:[
//					'src/*.js',
//					'grunt.js'
//				],
//				tasks:'concat min'
//			}
//		}
	});

	grunt.registerTask('default', 'shell');
}
