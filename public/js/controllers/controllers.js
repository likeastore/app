define(function (require) {
	var angular = require('angular');
	var DashboadController = require('./dashboard-controller');
	var GithubController = require('./github-controller');
	var TwitterController = require('./twitter-controller');
	var HeaderController = require('./header-controller');

	var controllers = angular.module('controllers', ['likeastore.services']);

	controllers.controller('dashboardController', DashboadController);
	controllers.controller('githubController', GithubController);
	controllers.controller('twitterController', TwitterController);
	controllers.controller('headerController', HeaderController);

	return controllers;
});