define(function (require) {
	'use strict';

	var angular = require('angular');
	var factory = require('./itemsControllerFactory');
	var controllers = angular.module('controllers', ['services']);

	// user settings
	controllers.controller('settingsController', require('./settingsController'));

	// items

	// title, target, event, resource
	controllers.controller('dashboardController', factory({title: 'All favorites', event: 'dashboard opened'}));
	controllers.controller('inboxController', factory({title: 'Inbox', target: 'inbox', event: 'inbox opened'}));
	controllers.controller('githubController', factory({title: 'Github', target: 'github', event: 'github opened'}));
	controllers.controller('facebookController', factory({title: 'Facebook', target: 'facebook', event: 'facebook opened'}));
	controllers.controller('twitterController', factory({title: 'Twitter', target: 'twitter', event: 'twitter opened'}));
	controllers.controller('stackoverflowController', factory({title: 'Stackoverflow', target: 'stackoverflow', event: 'stackoverflow opened'}));
	controllers.controller('vimeoController', factory({title: 'Vimeo', target: 'vimeo', event: 'vimeo opened'}));
	controllers.controller('youtubeController', factory({title: 'Youtube', target: 'youtube', event: 'youtube opened'}));
	controllers.controller('dribbbleController', factory({title: 'Dribbble', target: 'dribbble', event: 'dribbble opened'}));
	controllers.controller('behanceController', factory({title: 'Behance', target: 'behance', event: 'behance opened'}));
	controllers.controller('tumblrController', factory({title: 'Tumblr', target: 'tumblr', event: 'tumblr opened'}));
	controllers.controller('pocketController', factory({title: 'Pocket', target: 'pocket', event: 'pocket opened'}));
	controllers.controller('instagramController', factory({title: 'Instagram', target: 'instagram', event: 'instagram opened'}));
	controllers.controller('flickrController', factory({title: 'Flickr', target: 'flickr', event: 'flickr opened'}));

	// collections
	controllers.controller('collectionController', require('./collectionController'));
	controllers.controller('exploreController', require('./exploreController'));

	// search
	controllers.controller('searchController', require('./searchController'));

	// dialogs
	controllers.controller('shareWithFriendController', require('./shareWithFriendController'));
	controllers.controller('deleteUserController', require('./deleteUserController'));
	controllers.controller('shareLikeController', require('./shareLikeController'));
	controllers.controller('deleteCollectionController', require('./deleteCollectionController'));
	controllers.controller('shareCollectionController', require('./shareCollectionController'));
	controllers.controller('toggleStateCollectionController', require('./toggleStateCollectionController'));
	controllers.controller('shareFirstCollectionCreatedController', require('./shareFirstCollectionCreatedController'));

	// share and unblock
	controllers.controller('shareAndUnblockController', require('./shareAndUnblockController'));

	// errors
	controllers.controller('errorController', require('./errorController'));

	// custom networks
	controllers.controller('dribbbleNetworkController', require('./dribbbleNetworkController'));

	// history
	controllers.controller('historyController', require('./historyController'));

	// discovery
	controllers.controller('feedController', factory({title: 'Feed', event:'feed opened', resource: 'feed', track: 1}));
	controllers.controller('suggestPeopleController', require('./suggestPeopleController'));

	// profile
	controllers.controller('profileController', require('./profileController'));

	// onboarding
	controllers.controller('onboardingController', require('./onboardingController'));

	return controllers;
});
