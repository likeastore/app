/* Main app module */

'use strict'

var app = angular.module('likeastore', ['likeastore.services']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
	$routeProvider
		.when('/dashboard', { templateUrl: 'partials/dashboard', controller: DashboardCtrl })
		.when('/dashboard/all', { templateUrl: 'partials/dashboard', controller: DashboardCtrl })
		.when('/dashboard/github', { templateUrl: 'partials/dashboard', controller: GithubCtrl })
		.when('/dashboard/twitter', { templateUrl: 'partials/dashboard', controller: TwitterCtrl })
		.otherwise({ redirectTo: '/dashboard' });

	$locationProvider.html5Mode(true);
}]);