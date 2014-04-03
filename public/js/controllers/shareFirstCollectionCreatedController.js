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
				picture: 'https://tour.likeastore.com/img/hobbyist-badge-congratulations.png',
				description: 'Wanna get all your favorites from different services organized?\n' +
					'Create collections of your liked content with code libraries, Instagram photos, tweets, links, fonts, Dribbble shots and many more ' +
					'on https://likeastore.com and earn the limited edition of "Hobbyist" badge! ;)'
			});
		};
	}

	return ShareFirstCollectionCreatedController;
});