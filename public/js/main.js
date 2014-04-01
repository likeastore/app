require.config({
	paths: {
		'angular' : '../components/angular/angular',
		'ngResource': '../components/angular-resource/angular-resource',
		'ngRoute': '../components/angular-route/angular-route',
		'ngCookies': '../components/angular-cookies/angular-cookies',
		'ngAnimate': '../components/angular-animate/angular-animate',
		'ngTouch': '../components/angular-touch/angular-touch',
		'ngSanitize': '../components/angular-sanitize/angular-sanitize',
		'angularMoment': '../components/angular-moment/angular-moment',
		'ngProgressLite': '../components/ngprogress-lite/ngprogress-lite',
		'ngDialog': '../components/ngDialog/js/ngDialog',
		'ngIntercom': '../components/angular-intercom/angular-intercom',
		'angularLocalStorage': '../components/angularLocalStorage/src/angularLocalStorage',
		'hashids': '../components/hashids/lib/hashids',
		'seismo': '../components/seismo/seismo',
		'angulartics': '../components/angulartics/src/angulartics',
		'angulartics.mixpanel': '../components/angulartics/src/angulartics-mixpanel',
		'underscore': '../components/underscore/underscore',
		'moment': '../components/momentjs/moment',
		'modernizr': '../components/modernizr/modernizr',
		'facebook': '//connect.facebook.net/en_US/all',
		'twttr': '//platform.twitter.com/widgets'
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
		ngTouch: {
			deps: ['angular']
		},
		ngSanitize: {
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
		angulartics: {
			deps: ['angular']
		},
		angularMoment: {
			deps: ['angular']
		},
		'angulartics.mixpanel': {
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
		},
		underscore: {
			exports: '_'
		},
		moment: {
			exports: 'moment'
		},
		facebook: {
			exports: 'FB'
		},
		twttr: {
			exports: 'twttr'
		}
	},
	baseUrl: '/js'
});

require(['app', 'boot'], function (app, boot) {
	boot.getAccessToken(function () {
		app.init();
	});
});