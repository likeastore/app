define(function (require) {
	var angular = require('angular');
	var controllers = angular.module('controllers', ['services']);

	controllers.controller('dashboardController', require('./dashboard-controller'));
	controllers.controller('githubController', require('./github-controller'));
	controllers.controller('twitterController', require('./twitter-controller'));
	controllers.controller('headerController', require('./header-controller'));

	return controllers;
});