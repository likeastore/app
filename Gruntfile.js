module.exports = function (grunt) {
	grunt.initConfig({
		meta: {
			version: '0.0.1'
		},

		jshint: {
			options: {
				jshintrc: true
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
					'public/css/collection.css': 'myth/collection.css',
					'public/css/suggest.css': 'myth/suggest.css',
					'public/css/deckgrid.css': 'myth/deckgrid.css',
					'public/css/collgrid.css': 'myth/collgrid.css',
					'public/css/forms.css': 'myth/forms.css',
					'public/css/onboarding-dark.css': 'myth/onboarding-dark.css',
					'public/css/onboarding-light.css': 'myth/onboarding-light.css',
					'public/css/layout.css': 'myth/layout.css'
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
	grunt.loadNpmTasks('grunt-hashres2');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-myth');

	// Default task.
	grunt.registerTask('default', ['jshint']);
	grunt.registerTask('build', ['requirejs', 'myth', 'hashres']);
};
