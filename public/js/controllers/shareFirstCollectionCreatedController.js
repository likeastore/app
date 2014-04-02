define(function () {
	'use strict';

	function ShareFirstCollectionCreatedController ($scope, facebook, $analytics) {
		// saving badge for long live cookie for now
		document.cookie = 'hypebeastBadge=true; path=/; expires=' + new Date('January 1, 2020').toUTCString();

		$scope.shareOnTwitter = function () {
			$analytics.eventTrack('first collection badge shared', { on: 'twitter' });
		};

		$scope.shareOnFacebook = function () {
			$analytics.eventTrack('first collection badge shared', { on: 'facebook' });

			facebook.share({
				name: 'I\'ve just created my first collection on Likeastore!',
				link: 'https://likeastore.com',
				picture: 'https://likeastore.com/img/feed-box.png',
				description: 'Wanna get all your favorites from different services organized?\n' +
					'Create collections of your favorited content with code libraries, Instagram photos, tweets, links, fonts, Dribbble shots and many more ' +
					'on https://likeastore.com and earn the limited edition of "Hypebeast" badge! ;)'
			});
		};
	}

	return ShareFirstCollectionCreatedController;
});