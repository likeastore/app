define(function (require) {
	'use strict';

	var angular = require('angular');
	var services = require('./services/services');
	var controllers = require('./controllers/controllers');
	var directives = require('./directives/directives');

	var app = angular.module('likeastore', ['services', 'controllers', 'directives']);

	app.init = function () {
		angular.bootstrap(document, ['likeastore']);
	};

	app.config(['$routeProvider', '$locationProvider', '$httpProvider',
		function ($routeProvider, $locationProvider, $httpProvider) {
			$httpProvider.responseInterceptors.push('authInterceptor');

			$routeProvider
				.when('/', { templateUrl: 'partials/dashboard', controller: 'dashboardController' })
				.when('/inbox', { templateUrl: 'partials/dashboard', controller: 'dashboardController' })
				.when('/facebook', { templateUrl: 'partials/dashboard', controller: 'facebookController' })
				.when('/github', { templateUrl: 'partials/dashboard', controller: 'githubController' })
				.when('/twitter', { templateUrl: 'partials/dashboard', controller: 'twitterController' })
				.when('/stackoverflow', { templateUrl: 'partials/dashboard', controller: 'stackoverflowController' })
				.when('/settings', { templateUrl: 'partials/settings', controller: 'settingsController' })
				.otherwise({ redirectTo: '/' });

			$locationProvider.html5Mode(true);
		}
	]);

	app.run(function ($window, auth, user) {
		auth.setAuthorizationHeaders();
		user.initialize();

		if ($window.location.hash === '#_=_') {
			$window.location.hash = '';
		}
	});

	return app;
});