define(function (require) {
	'use strict';

	var angular = require('angular');
	var itemsControllerFactory = require('./itemsControllerFactory');
	var controllers = angular.module('controllers', ['services']);

	// user settings
	controllers.controller('settingsController', require('./settingsController'));

	// items
	controllers.controller('dashboardController', itemsControllerFactory('All favorites', null, 'dashboard opened'));
	controllers.controller('inboxController', itemsControllerFactory('Inbox', 'inbox', 'inbox opened'));
	controllers.controller('githubController', itemsControllerFactory('Github', 'github', 'github opened'));
	controllers.controller('facebookController', itemsControllerFactory('Facebook', 'facebook', 'facebook opened'));
	controllers.controller('twitterController', itemsControllerFactory('Twitter', 'twitter', 'twitter opened'));
	controllers.controller('stackoverflowController', itemsControllerFactory('Stackoverflow', 'stackoverflow', 'stackoverflow opened'));
	controllers.controller('vimeoController', itemsControllerFactory('Vimeo', 'vimeo', 'vimeo opened'));
	controllers.controller('youtubeController', itemsControllerFactory('Youtube', 'youtube', 'youtube opened'));
	controllers.controller('dribbbleController', itemsControllerFactory('Dribbble', 'dribbble', 'dribbble opened'));
	controllers.controller('behanceController', itemsControllerFactory('Behance', 'behance', 'behance opened'));
	controllers.controller('tumblrController', itemsControllerFactory('Tumblr', 'tumblr', 'tumblr opened'));
	controllers.controller('pocketController', itemsControllerFactory('Pocket', 'pocket', 'pocket opened'));

	// collections
	controllers.controller('collectionController', require('./collectionController'));

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

	// history
	controllers.controller('historyController', require('./historyController'));

	// discovery
	controllers.controller('suggestPeopleController', require('./suggestPeopleController'));
	controllers.controller('discoverController', itemsControllerFactory('Discover', null, 'discover opened', 'discover', true));
	controllers.controller('profileController', require('./profileController'));

	return controllers;
});