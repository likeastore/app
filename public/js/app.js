define(function (require) {
	'use strict';

	require('modernizr');
	require('ngRoute');
	require('ngAnimate');
	require('ngTouch');
	require('ngSanitize');
	require('ngDialog');
	require('ngIntercom');
	require('ngCustomerVoice');
	require('angularLocalStorage');
	require('angulartics');
	require('angulartics.mixpanel');
	require('angular-deckgrid');
	require('moment');
	require('angularMoment');
	require('underscore');
	require('facebook');
	require('twttr');
	require('elastic');

	require('./services/services');
	require('./controllers/controllers');
	require('./directives/directives');
	require('./filters/filters');

	var angular = require('angular');
	var app = angular.module('likeastore', [
		'ngRoute',
		'ngAnimate',
		'ngTouch',
		'ngSanitize',
		'ngDialog',
		'angularLocalStorage',
		'ngIntercom',
		'angulartics',
		'angulartics.mixpanel',
		'angularMoment',
		'akoenig.deckgrid',
		'ngCustomerVoice',
		'monospaced.elastic',
		'services',
		'controllers',
		'directives',
		'filters'
	]);

	app.init = function () {
		angular.bootstrap(document, ['likeastore']);
	};

	app.config(['$routeProvider', '$locationProvider', '$httpProvider', 'IntercomServiceProvider', 'ngCustomerVoiceProvider',
		function ($routeProvider, $locationProvider, $httpProvider, intercomServiceProvider, ngCustomerVoiceProvider) {
			$httpProvider.interceptors.push('httpInterceptor');

			$routeProvider
				.when('/', { templateUrl: 'partials/dashboard', controller: 'dashboardController' })
				.when('/all', { templateUrl: 'partials/dashboard', controller: 'dashboardController' })
				.when('/favorites', { templateUrl: 'partials/dashboard', controller: 'dashboardController' })
				.when('/inbox', { templateUrl: 'partials/dashboard', controller: 'inboxController' })
				.when('/facebook', { templateUrl: 'partials/dashboard', controller: 'facebookController' })
				.when('/github', { templateUrl: 'partials/dashboard', controller: 'githubController' })
				.when('/vimeo', { templateUrl: 'partials/dashboard', controller: 'vimeoController' })
				.when('/youtube', { templateUrl: 'partials/dashboard', controller: 'youtubeController' })
				.when('/dribbble', { templateUrl: 'partials/dashboard', controller: 'dribbbleController' })
				.when('/behance', { templateUrl: 'partials/dashboard', controller: 'behanceController' })
				.when('/twitter', { templateUrl: 'partials/dashboard', controller: 'twitterController' })
				.when('/tumblr', { templateUrl: 'partials/dashboard', controller: 'tumblrController' })
				.when('/pocket', { templateUrl: 'partials/dashboard', controller: 'pocketController' })
				.when('/instagram', { templateUrl: 'partials/dashboard', controller: 'instagramController' })
				.when('/flickr', { templateUrl: 'partials/dashboard', controller: 'flickrController' })
				.when('/stackoverflow', { templateUrl: 'partials/dashboard', controller: 'stackoverflowController' })
				.when('/search', { templateUrl: 'partials/search', controller: 'searchController' })
				.when('/feed', { templateUrl: 'partials/feed', controller: 'feedController' })
				.when('/explore', { templateUrl: 'partials/explore', controller: 'exploreController' })
				.when('/discover', { templateUrl: 'partials/explore', controller: 'exploreController' })
				.when('/settings', { templateUrl: 'partials/settings', controller: 'settingsController' })
				.when('/suggest', { templateUrl: 'partials/suggest', controller: 'suggestPeopleController' })
				.when('/u/:name', { templateUrl: 'partials/profile', controller: 'profileController',
					reloadOnSearch: false,
					resolve: {
						'rsAppUser': function (user) {
							return user.initialize();
						}
					}})
				.when('/u/:name/:id', { templateUrl: 'partials/collection', controller: 'collectionController',
					reloadOnSearch: false,
					resolve: {
						'rsAppUser': function (user) {
							return user.initialize();
						},
						'rsUserCollections': function (user) {
							return user.getCollections();
						}
					}})
				.when('/u/:name/discuss/:id', { templateUrl: 'partials/discuss', controller: 'discussController'})
				.when('/ooops', { templateUrl: 'errorView', controller: 'errorController' })
				.otherwise({ redirectTo: '/' });

			$locationProvider.html5Mode(true);

			ngCustomerVoiceProvider.apiUrl('/api/users/feedback');
			ngCustomerVoiceProvider.closeBeforeSend(true);
			intercomServiceProvider.asyncLoading(true);
		}
	]);

	app.run(function (user, tracking, facebook, utils, $templateCache, $http) {
		user.initialize().then(function () {
			user.getInboxCount();
			user.getCollections();
			user.getActiveNetworks();
		});

		tracking.boot();
		facebook.init();

		utils.addGlobals().cacheTemplates();
	});

	return app;
});
