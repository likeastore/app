require.config({
	paths: {
		'angular' : '../components/angular/angular',
		'ngResource': '../components/angular-resource/angular-resource',
		'ngCookies': '../components/angular-cookies/angular-cookies',
		'ngProgress': '../components/ngprogress/build/ngProgress'
	},
	shim: {
		ngResource: {
			deps: ['angular'],
			exports: 'angular'
		},
		ngCookies: {
			deps: ['angular'],
			exports: 'angular'
		},
		ngProgress: {
			deps: ['angular']
		},
		angular: {
			exports : 'angular'
		}
	},
	baseUrl: '/js'
});

require(['app', 'boot'], function (app, boot) {
	boot.getAccessToken(function () {
		app.init();
	});
});