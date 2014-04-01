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
				"unused": "vars",
				globals: {
					angular: true,
					require: true,
					define: true,
					_: true,
					FB: true,
					twttr: true
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
				dest: { src: 'tools/client/index.js', out: 'public/build/index.js' }
			}
		},


		myth: {
			all: {
				files: {
					'public/css/general.css': 'myth/general.css',
					'public/css/icons.css': 'myth/icons.css',
					'public/css/settings.css': 'myth/settings.css',
					'public/css/profile.css': 'myth/profile.css',
					'public/css/suggest.css': 'myth/suggest.css'
				}
			}
		},

		watch: {
			styles: {
				files: ['myth/**/*.css'],
				tasks: ['myth']
			}
		}
	});

	// Loaded tasks
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-hashres');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-myth');

	// Default task.
	grunt.registerTask('default', ['jshint']);
	grunt.registerTask('build', ['requirejs', 'myth', 'hashres']);
};
