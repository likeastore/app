define(function (require) {
	'use strict';

	require('modernizr');
	require('ngRoute');
	require('ngAnimate');
	require('ngTouch');
	require('ngSanitize');
	require('ngDialog');
	require('ngIntercom');
	require('angularLocalStorage');
	require('angulartics');
	require('angulartics.mixpanel');
	require('moment');
	require('angularMoment');
	require('underscore');
	require('facebook');
	require('twttr');

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
		'services',
		'controllers',
		'directives',
		'filters'
	]);

	app.init = function () {
		angular.bootstrap(document, ['likeastore']);
	};

	app.config(['$routeProvider', '$locationProvider', '$httpProvider', 'IntercomServiceProvider',
		function ($routeProvider, $locationProvider, $httpProvider, intercomServiceProvider) {
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
				.when('/search', { templateUrl: 'partials/dashboard', controller: 'searchController' })
				.when('/items/:id', { templateUrl: 'partials/dashboard', controller: 'dashboardController'})
				.when('/discover', { templateUrl: 'partials/discover', controller: 'discoverController' })
				.when('/settings', { templateUrl: 'partials/settings', controller: 'settingsController' })
				.when('/suggest', { templateUrl: 'partials/suggest', controller: 'suggestPeopleController' })
				.when('/u/:name', { templateUrl: 'partials/profile', controller: 'profileController' })
				.when('/collections/:id', { templateUrl: 'partials/dashboard', controller: 'collectionController'})
				.when('/ooops', { templateUrl: 'errorView', controller: 'errorController' })
				.otherwise({ redirectTo: '/' });

			$locationProvider.html5Mode(true);

			intercomServiceProvider.asyncLoading(true);
		}
	]);

	app.run(function (user, tracking, facebook, rooter) {
		user.initialize().$promise.then(function () {
			user.getInboxCount()
				.getCollections()
				.getActiveNetworks();
		});

		tracking.boot();
		facebook.init();

		rooter();
	});

	return app;
});
