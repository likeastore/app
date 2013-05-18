'use strict';

define(function (require) {
	var angular = require('angular');
	var controllers = angular.module('controllers', ['services']);

	// header
	controllers.controller('headerController', require('./headerController'));

	// items
	controllers.controller('dashboardController', require('./dashboardController'));
	controllers.controller('githubController', require('./githubController'));
	controllers.controller('twitterController', require('./twitterController'));
	controllers.controller('stackoverflowController', require('./stackoverflowController'));

	return controllers;
});