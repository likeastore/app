require.config({
	paths: {
		'angular' : '../components/angular/angular',
		'ngResource': '../components/angular-resource/angular-resource',
		'ngRoute': '../components/angular-route/angular-route',
		'ngCookies': '../components/angular-cookies/angular-cookies',
		'ngAnimate': '../components/angular-animate/angular-animate',
		'ngProgressLite': '../components/ngprogress-lite/ngprogress-lite',
		'ngDialog': '../components/ngDialog/js/ngDialog',
		'ngIntercom': '../components/angular-intercom/angular-intercom',
		'angularLocalStorage': '../components/angularLocalStorage/src/angularLocalStorage',
		'hashids': '../components/hashids/lib/hashids',
		'seismo': '../components/seismo/seismo'
	},
	shim: {
		ngResource: {
			deps: ['angular']
		},
		ngRoute: {
			deps: ['angular']
		},
		ngCookies: {
			deps: ['angular']
		},
		ngAnimate: {
			deps: ['angular']
		},
		ngProgressLite: {
			deps: ['angular']
		},
		ngDialog: {
			deps: ['angular']
		},
		ngIntercom: {
			deps: ['angular']
		},
		angularLocalStorage: {
			deps: ['angular']
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