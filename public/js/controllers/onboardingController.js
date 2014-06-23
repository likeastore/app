define(function (require) {
	'use strict';

	var config = require('config');

	function onboardingController ($scope, $document, $window, $rootScope, $location, api, $analytics) {
		var $body = $document.find('body');
		var events = [
			'welcome',
			'networks',
			'collections',
			'extensions'
		];

		var properSlide = ($location.url() === '/settings') ? '2' : '0';
		var delayedWarning;

		$rootScope.$watch('user', function (value) {
			if ($window.innerWidth < 620) {
				return;
			}
			if (!value) {
				return;
			}

			if (!value.watchedPreview) {
				if (value.warning) {
					delayedWarning = true;
					$rootScope.user.warning = false;
				}
				$scope.showPreviewHelp = true;
				$location.url('/feed');
			} else if (value.watchedPreview && $rootScope.extension && !value.watchedOnlyExtension) {
				if (value.warning) {
					delayedWarning = true;
					$rootScope.user.warning = false;
				}
				$scope.showOnlyExtensionHelp = true;
				$location.url('/feed');
			}
		});

		$scope['slide' + properSlide] = true;
		$scope.collectionFollowedCount = 0;
		$scope.currentSlide = +properSlide;
		$scope.fcolls = _(config.featuredCollections).shuffle().slice(0, 4);
		$scope.fnets = _(config.featuredNetworks).shuffle().slice(0, 10);
		$analytics.eventTrack('onboarding ' + events[$scope.currentSlide] + ' opened');

		$scope.goToSlide = function (slideNum) {
			if (slideNum > $scope.currentSlide) {
				$scope['slide' + (slideNum - 1)] = false;
			} else {
				$scope['slide' + (slideNum + 1)] = false;
			}

			/* NB: used on arrows onboarding
			if (slideNum === 3) {
				$body.addClass('sidebar-active');
			} else {
				$body.removeClass('sidebar-active');
			}*/

			$scope['slide' + slideNum] = true;
			$scope.currentSlide = slideNum;
			$analytics.eventTrack('onboarding ' + events[$scope.currentSlide] + ' opened');
		};

		$scope.networkEnabled = function (network) {
			$analytics.eventTrack('onboarding network enabled', {network: network});
		};

		$scope.collectionFollowed = function (title) {
			$analytics.eventTrack('onboarding collection followed', {title: title, count: $scope.collectionFollowedCount++ });
		};

		$scope.finish = function () {
			api.patch({ resource: 'users', target: 'me' }, { watchedPreview: true, watchedOnlyExtension: true }, function () {
				$body.removeClass('sidebar-active');
				$rootScope.user.watchedPreview = true;
				$scope.showPreviewHelp = false;
				$analytics.eventTrack('onboarding finished');

				$location.url('/feed');

				if (delayedWarning) {
					$rootScope.user.warning = true;
				}
			});
		};

		$scope.finishWhenOnlyExtension = function () {
			api.patch({ resource: 'users', target: 'me' }, { watchedOnlyExtension: true }, function () {
				$body.removeClass('sidebar-active');
				$rootScope.user.watchedPreview = true;
				$scope.showOnlyExtensionHelp = false;
				$analytics.eventTrack('onboarding finished');

				$location.url('/feed');

				if (delayedWarning) {
					$rootScope.user.warning = true;
				}
			});
		};

		$scope.likeOnFacebook = function () {
			$analytics.eventTrack('liked on facebook via onboarding');
			$window.open('https://www.facebook.com/likeastore', 'Likeastore on Facebook', 'width=900,height=600,resizable=yes');
		};

		$scope.followOnTwitter = function () {
			$analytics.eventTrack('followed on twitter via onboarding');
		};

		$scope.installPlugin = function () {
			$analytics.eventTrack('onboarding installed plugin');
		};
	}

	return onboardingController;
});
