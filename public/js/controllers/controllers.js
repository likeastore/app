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
	controllers.controller('vimeoController', itemsControllerFactory('Vimeo', 'vimeo'));
	controllers.controller('youtubeController', itemsControllerFactory('Youtube', 'youtube'));
	controllers.controller('dribbbleController', itemsControllerFactory('Dribbble', 'dribbble'));
	controllers.controller('behanceController', itemsControllerFactory('Behance', 'behance'));

	// search
	controllers.controller('searchController', require('./searchController'));

	// dialogs
	controllers.controller('shareWithFriendController', require('./shareWithFriendController'));
	controllers.controller('deleteUserController', require('./deleteUserController'));
	controllers.controller('shareLikeController', require('./shareLikeController'));

	// errors
	controllers.controller('errorController', require('./errorController'));

	// custom networks
	controllers.controller('dribbbleNetworkController', require('./dribbbleNetworkController'));

	return controllers;
});