module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-shell');

	grunt.initConfig({
		shell: {
			delete_build_folder: {
				command: 'rm -r build/',
				stdout: true
			},
			update_build_from_master: {
				command: 'git checkout master build',
				stdout: true
			},
			delete_demos_folder: {
				command: 'rm -r demos/',
				stdout: true
			},
			update_demos_from_master: {
				command: 'git checkout master demos',
				stdout: true
			},
			delete_src_folder: {
				command: 'rm -r src/',
				stdout: true
			},
			update_src_from_master: {
				command: 'git checkout master src',
				stdout: true
			},
			delete_tests_folder: {
				command: 'rm -r tests/',
				stdout: true
			},
			update_tests_from_master: {
				command: 'git checkout master tests',
				stdout: true
			}
		}
	});

	grunt.registerTask('default', ['shell']);

}