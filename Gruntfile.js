module.exports = function(grunt) {
	grunt.initConfig({
		meta: {
			version: '0.0.1'
		},

		jshint: {
			options: {
				"asi" : false,
				"bitwise" : true,
				"boss" : false,
				"curly" : true,
				"debug": false,
				"devel": false,
				"eqeqeq": true,
				"evil": false,
				"expr": true,
				"forin": false,
				"immed": true,
				"latedef" : false,
				"laxbreak": false,
				"multistr": true,
				"newcap": true,
				"noarg": true,
				"node" : true,
				"browser": true,
				"noempty": false,
				"nonew": true,
				"onevar": false,
				"plusplus": false,
				"regexp": false,
				"strict": false,
				"sub": false,
				"trailing" : true,
				"undef": true,
				globals: {
					jQuery: true,
					Backbone: true,
					_: true,
					$: true,
					require: true,
					define: true
				}
			},
			js: ['public/js/**/*.js', 'source/**/*.js']
		},

		requirejs: {
			js: {
				options: {
					uglify2: {
						mangle: false
					},
					baseUrl: "public/js",
					mainConfigFile: "public/js/main.js",
					name: 'main',
					out: "public/build/main.js",
					optimize: 'uglify2'
				}
			},
			css: {
				options: {
					baseUrl: 'public/css',
					cssIn: "public/css/main.css",
					out: "public/build/main.css",
					cssImportIgnore: null,
					optimizeCss: 'default'
				}
			}
		},

		hashres: {
			options: {
				fileNameFormat: '${name}-${hash}.${ext}'
			},
			prod: {
				src: [
					'public/build/main.js',
					'public/build/main.css'
				],
				dest: { src: 'tools/client/index.js', out: 'source/client/index.js' }
			}
		}
	});

	// Laoded tasks
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-hashres');

	// Default task.
	grunt.registerTask('default', ['jshint', 'requirejs', 'hashres']);
	grunt.registerTask('build', ['requirejs', 'hashres']);
};
