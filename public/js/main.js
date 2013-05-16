require.config({
	paths: {
		'angular' : '../components/angular/angular',
		'ngResource': '../components/angular-resource/angular-resource'
	},
	shim: {
		ngResource: {
			deps: ['angular'],
			exports: 'angular'
		},
		angular: {
			exports : 'angular'
		}
	},
	baseUrl: '/js'
});

require(['app'], function(app) {
	app.initialize(window.document);
});