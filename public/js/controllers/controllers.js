define(function (require) {
	'use strict';

	var angular = require('angular');
	var controllers = angular.module('controllers', ['services']);

	// user settings
	controllers.controller('settingsController', require('./settingsController'));

	// items
	controllers.controller('dashboardController', require('./dashboardController'));
	controllers.controller('githubController', require('./githubController'));
	controllers.controller('facebookController', require('./facebookController'));
	controllers.controller('twitterController', require('./twitterController'));
	controllers.controller('stackoverflowController', require('./stackoverflowController'));

	// search
	controllers.controller('searchController', require('./searchController'));

	return controllers;
});