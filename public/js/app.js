define(function (require) {

	var angular = require('angular');
	var DashboadController = require('./controllers/dashboard-controller');
	var GithubController = require('./controllers/github-controller');
	var TwitterController = require('./controllers/twitter-controller');

	function initialize (doc) {
		var app = angular.module('likeastore', ['likeastore.services']);

		app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
			$routeProvider
				.when('/', { templateUrl: 'partials/dashboard', controller: DashboadController })
				.when('/all', { templateUrl: 'partials/dashboard', controller: DashboadController })
				.when('/github', { templateUrl: 'partials/dashboard', controller: GithubController })
				.when('/twitter', { templateUrl: 'partials/dashboard', controller: TwitterController })
				.otherwise({ redirectTo: '/dashboard' });

			$locationProvider.html5Mode(true);
		}]);

		angular.bootstrap(doc,['likeastore']);
	}

	return {
		initialize: initialize
	};
});