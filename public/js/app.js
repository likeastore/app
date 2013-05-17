define(function (require) {

	var angular = require('angular');
	var services = require('./services/services');
	var controller = require('./controllers/controllers');

	function initialize (doc) {
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

		angular.bootstrap(doc,['likeastore']);
		return app;
	}

	return {
		initialize: initialize
	};
});