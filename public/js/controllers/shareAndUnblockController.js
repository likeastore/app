define(function () {
	'use strict';

	var angular = require('angular');

	function ShareAndUnblockController ($scope, $rootScope, $document, api, user, $analytics, analytics) {
		twttr.widgets.load();
		twttr.events.bind('tweet', function () {
			unblockNetworks();
		});

		function unblockNetworks () {
			$analytics.eventTrack('app shared'); // mixpanel
			analytics.track('app-shared'); // seismo

			$scope.thanks = true;
			user.unblockConnections()
				.getActiveNetworks();
		}

		$scope.shareOnFacebook = function (link, caption) {
			FB.ui({
				method: 'feed',
				name: 'Check out likeastore.com - Social Bookmarking for Geeks!',
				link: 'https://likeastore.com',
				picture: 'https://likeastore.com/img/feed-box.png',
				description: 'The best way to save useful resources like GitHub repositories, code libraries, Instagram photos, fonts, Dribbble shots or Stackoverflow questions. Organize your favorites, create collections and share them with friends.'
			}, function (res) {
				if (res && res._id) {
					unblockNetworks();
				}
			});
		};

		$scope.closeShare = function (e, mpEvent) {
			$analytics.eventTrack(mpEvent);

			if (!$document.find('html').hasClass('cssanimations')) {
				$scope.$parent.onBlockNetworks = false;
				return;
			}

			var $overlay = angular.element(e.target).parent().parent();
			$overlay.addClass('fadeOutUpBig');
			$overlay.bind('animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend', onAnimationEnd);
			function onAnimationEnd () {
				$overlay.removeClass('fadeOutUpBig');
				$overlay.unbind();
				$scope.$parent.onBlockNetworks = false;
				$scope.$apply();
			}
		};
	}

	return ShareAndUnblockController;
});
