require.config({
	paths: {
		'angular' : '../components/angular/angular',
		'ngResource': '../components/angular-resource/angular-resource',
		'ngRoute': '../components/angular-route/angular-route',
		'ngCookies': '../components/angular-cookies/angular-cookies',
		'ngProgressLite': '../components/ngprogress-lite/ngprogress-lite',
		'ngDialog': '../components/ngDialog/js/ngDialog',
		'hashids': '../components/hashids/lib/hashids',
		'seismo': '../components/seismo/seismo'
	},
	shim: {
		ngResource: {
			deps: ['angular'],
			exports: 'angular'
		},
		ngRoute: {
			deps: ['angular'],
			exports: 'angular'
		},
		ngCookies: {
			deps: ['angular'],
			exports: 'angular'
		},
		ngProgressLite: {
			deps: ['angular'],
			exports: 'angular'
		},
		ngDialog: {
			deps: ['angular'],
			exports: 'angular'
		},
		angular: {
			exports: 'angular'
		},
		hashids: {
			exports: 'Hashids'
		},
		seismo: {
			exports: 'seismo'
		}
	},
	baseUrl: '/js'
});

require(['app', 'boot'], function (app, boot) {
	boot.getAccessToken(function () {
		app.init();
	});
});