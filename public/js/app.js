define(function (require) {

	var angular = require('angular');
	var controller = require('./controllers/controllers');

	function initialize (doc) {
		var app = angular.module('likeastore', ['likeastore.services', 'controllers']);

		app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
			$routeProvider
				.when('/', { templateUrl: 'partials/dashboard', controller: 'dashboardController' })
				.when('/all', { templateUrl: 'partials/dashboard', controller: 'dashboardController' })
				.when('/github', { templateUrl: 'partials/dashboard', controller: 'githubController' })
				.when('/twitter', { templateUrl: 'partials/dashboard', controller: 'twitterController' })
				.otherwise({ redirectTo: '/dashboard' });

			$locationProvider.html5Mode(true);
		}]);

		angular.bootstrap(doc,['likeastore']);
	}

	return {
		initialize: initialize
	};
});