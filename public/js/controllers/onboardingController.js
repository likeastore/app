define(function (require) {
	'use strict';

	function onboardingController ($scope, $document, $window, $rootScope, $location, api, $analytics) {
		var $body = $document.find('body');
		var delayedWarning;

		$rootScope.$watch('user', function (value) {
			if (value && !value.watchedPreview && $window.innerWidth >= 920) {
				if (value.warning) {
					delayedWarning = true;
					$rootScope.user.warning = false;
				}
				$scope.showPreviewHelp = true;
			}
		});

		$scope.slide1 = true;
		$scope.currentSlide = 1;

		$scope.goToSlide = function (slideNum) {
			if (slideNum > $scope.currentSlide) {
				$scope['slide' + (slideNum-1)] = false;
			} else {
				$scope['slide' + (slideNum+1)] = false;
			}

			if (slideNum === 3) {
				$body.addClass('sidebar-active');
			} else {
				$body.removeClass('sidebar-active');
			}

			$scope['slide' + slideNum] = true;
			$scope.currentSlide = slideNum;
		};

		$scope.finish = function () {
			api.patch({ resource: 'users', target: 'me' }, { watchedPreview: true }, function () {
				$body.removeClass('sidebar-active');
				$location.url('/');
				$rootScope.user.watchedPreview = true;
				$scope.showPreviewHelp = false;

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
			$analytics.eventTrack('go to extension via onboarding');
		};
	}

	return onboardingController;
});
