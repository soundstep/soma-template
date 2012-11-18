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
	});

	grunt.registerTask('default', 'shell');
}
