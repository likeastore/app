define(function (require) {
	'use strict';

	var angular = require('angular');
	var services = require('./services/services');
	var controllers = require('./controllers/controllers');

	var app = angular.module('likeastore', ['services', 'controllers']);

	app.config(['$routeProvider', '$locationProvider', '$httpProvider',
		function ($routeProvider, $locationProvider, $httpProvider) {
			$httpProvider.responseInterceptors.push('authInterceptor');

			$routeProvider
				.when('/', { templateUrl: 'partials/dashboard', controller: 'dashboardController' })
				.when('/inbox', { templateUrl: 'partials/dashboard', controller: 'dashboardController' })
				.when('/github', { templateUrl: 'partials/dashboard', controller: 'githubController' })
				.when('/twitter', { templateUrl: 'partials/dashboard', controller: 'twitterController' })
				.when('/stackoverflow', { templateUrl: 'partials/dashboard', controller: 'stackoverflowController' })
				.otherwise({ redirectTo: '/' });

			$locationProvider.html5Mode(true);
		}
	]);

	app.init = function () {
		angular.bootstrap(document, ['likeastore']);
	};

	app.run(function ($window) {
		if ($window.location.hash === '#_=_') {
			$window.location.hash = '';
		}
	});

	return app;
});