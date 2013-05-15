require.config({
	paths: {
		'jQuery': '../components/jquery/jquery',
		'angular' : '../components/angular/angular',
		'ngResource': '../components/angular-resource/angular-resource'
	},
	shim: {
		ngResource: {
			deps: ['angular'],
			exports: 'angular'
		},
		angular: {
			deps: ['jQuery'],
			exports : 'angular'
		},
		jQuery: {
			exports: 'jQuery'
		}
	},
	baseUrl: '/js'
});

require(['app'], function(app) {
	app.initialize(window.document);
});