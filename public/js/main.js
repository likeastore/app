require.config({
	paths: {
		'angular' : '../components/angular/angular',
		'ngResource': '../components/angular-resource/angular-resource',
		'ngRoute': '../components/angular-route/angular-route',
		'ngCookies': '../components/angular-cookies/angular-cookies',
		'ngAnimate': '../components/angular-animate/angular-animate',
		'ngProgressLite': '../components/ngprogress-lite/ngprogress-lite',
		'ngDialog': '../components/ngDialog/js/ngDialog',
		'angularLocalStorage': '../components/angularLocalStorage/src/angularLocalStorage',
		'hashids': '../components/hashids/lib/hashids',
		'seismo': '../components/seismo/seismo',
		'ngIntercom': '../components/angular-intercom/angular-intercom',
		'angulartics': '../components/angulartics/src/angulartics',
		'angulartics.mixpanel': '../components/angulartics/src/angulartics-mixpanel'
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
		ngAnimate: {
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
		angularLocalStorage: {
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
		},
		ngIntercom: {
			deps: ['angular']
		},
		angulartics: {
			deps: ['angular']
		},
		'angulartics.mixpanel': {
			deps: ['angular']
		}
	},
	baseUrl: '/js'
});

require(['app', 'boot'], function (app, boot) {
	boot.getAccessToken(function () {
		app.init();
	});
});