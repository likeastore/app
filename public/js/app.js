define(function (require) {
	'use strict';

	var angular = require('angular');
	var services = require('./services/services');
	var controllers = require('./controllers/controllers');
	var directives = require('./directives/directives');

	var dashboardController = require('./controllers/dashboardController');
	var githubController = require('./controllers/githubController');
	var twitterController = require('./controllers/twitterController');
	var stackoverflowController = require('./controllers/stackoverflowController');
	var settingsController = require('./controllers/settingsController');

	var app = angular.module('likeastore', ['services', 'controllers', 'directives']);

	app.init = function () {
		angular.bootstrap(document, ['likeastore']);
	};

	app.config(['$routeProvider', '$locationProvider', '$httpProvider',
		function ($routeProvider, $locationProvider, $httpProvider) {
			$httpProvider.responseInterceptors.push('authInterceptor');

			$routeProvider
				.when('/', {
					templateUrl: 'partials/dashboard',
					controller: dashboardController,
					resolve: dashboardController.resolve
				})
				.when('/inbox', {
					templateUrl: 'partials/dashboard',
					controller: dashboardController,
					resolve: dashboardController.resolve
				})
				.when('/github', {
					templateUrl: 'partials/dashboard',
					controller: githubController,
					resolve: githubController.resolve
				})
				.when('/twitter', {
					templateUrl: 'partials/dashboard',
					controller: twitterController,
					resolve: twitterController.resolve
				})
				.when('/stackoverflow', {
					templateUrl: 'partials/dashboard',
					controller: stackoverflowController,
					resolve: stackoverflowController.resolve
				})
				.when('/settings', {
					templateUrl: 'partials/settings',
					controller: settingsController,
					resolve: settingsController.resolve
				})
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