define(function (require) {
	'use strict';

	var angular = require('angular');
	var itemsControllerFactory = require('./itemsControllerFactory');
	var controllers = angular.module('controllers', ['services']);

	// user settings
	controllers.controller('settingsController', require('./settingsController'));

	// items
	controllers.controller('dashboardController', itemsControllerFactory('All Likes'));
	controllers.controller('inboxController', itemsControllerFactory('Inbox', 'inbox'));
	controllers.controller('githubController', itemsControllerFactory('Github', 'github'));
	controllers.controller('facebookController', itemsControllerFactory('Facebook', 'facebook'));
	controllers.controller('twitterController', itemsControllerFactory('Twitter', 'twitter'));
	controllers.controller('stackoverflowController', itemsControllerFactory('Stackoverflow', 'stackoverflow'));

	// search
	controllers.controller('searchController', require('./searchController'));

	// dialogs
	controllers.controller('shareWithFriendController', require('./shareWithFriendController'));
	controllers.controller('deleteUserController', require('./deleteUserController'));

	// errors
	controllers.controller('errorController', require('./errorController'));

	return controllers;
});