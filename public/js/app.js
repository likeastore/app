define(function (require) {
	'use strict';

	require('ngRoute');
	require('ngAnimate');
	require('ngDialog');
	require('ngIntercom');
	require('angularLocalStorage');
	require('angulartics');
	require('angulartics.mixpanel');

	require('./services/services');
	require('./controllers/controllers');
	require('./directives/directives');

	var angular = require('angular');
	var app = angular.module('likeastore', [
		'ngRoute',
		'ngAnimate',
		'ngDialog',
		'angularLocalStorage',
		'ngIntercom',
		'angulartics',
		'angulartics.mixpanel',
		'services',
		'controllers',
		'directives'
	]);

	app.init = function () {
		angular.bootstrap(document, ['likeastore']);
	};

	app.config(['$routeProvider', '$locationProvider', '$httpProvider', 'IntercomServiceProvider',
		function ($routeProvider, $locationProvider, $httpProvider, intercomServiceProvider) {
			$httpProvider.interceptors.push('httpInterceptor');

			$routeProvider
				.when('/', { templateUrl: 'partials/dashboard', controller: 'dashboardController' })
				.when('/all', { templateUrl: 'partials/dashboard', controller: 'dashboardController' })
				.when('/inbox', { templateUrl: 'partials/dashboard', controller: 'inboxController' })
				.when('/facebook', { templateUrl: 'partials/dashboard', controller: 'facebookController' })
				.when('/github', { templateUrl: 'partials/dashboard', controller: 'githubController' })
				.when('/vimeo', { templateUrl: 'partials/dashboard', controller: 'vimeoController' })
				.when('/youtube', { templateUrl: 'partials/dashboard', controller: 'youtubeController' })
				.when('/dribbble', { templateUrl: 'partials/dashboard', controller: 'dribbbleController' })
				.when('/behance', { templateUrl: 'partials/dashboard', controller: 'behanceController' })
				.when('/twitter', { templateUrl: 'partials/dashboard', controller: 'twitterController' })
				//.when('/history', { templateUrl: 'partials/dashboard', controller: 'historyController' })
				.when('/stackoverflow', { templateUrl: 'partials/dashboard', controller: 'stackoverflowController' })
				.when('/search', { templateUrl: 'partials/dashboard', controller: 'searchController' })
				.when('/settings', { templateUrl: 'partials/settings', controller: 'settingsController' })
				.when('/ooops', { templateUrl: 'partials/dashboard', controller: 'errorController' })
				.otherwise({ redirectTo: '/' });

			$locationProvider.html5Mode(true);

			intercomServiceProvider.asyncLoading(true);
		}
	]);

	app.run(function (user, intercom) {
		user.initialize()
			.getActiveNetworks();
		intercom.boot();
	});

	return app;
});