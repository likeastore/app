define(function () {
	'use strict';

	function ShareWithFriendController($rootScope, $scope, $timeout, api, $analytics, seismo, facebook, mixpanel) {
		$scope.sendText = 'Send';
		$scope.message = '\
I want to share Likeastore with you. It helps me to connect all my social networks, like Twitter and Facebook and keep all my favorites in one place.\
\n\n\
https://likeastore.com';

		$scope.send = function () {
			var user = $rootScope.user;
			var email = $scope.email;
			var message = $scope.message;

			var payload = {
				to: email,
				from: user.email,
				username: user.displayName || user.name || user.username,
				message: message
			};

			changeSendText('Sending');
			api.save({resource: 'emails', target: 'share'}, payload,
				function (res) {
					$scope.email = '';
					changeSendText('Thank you!');

					$analytics.eventTrack('shared with friend', {via: 'email'});
					seismo.track('share-with-friend', {via: 'email'});
					mixpanel.people.increment('Shares with Friend', {via: 'email'});

					$timeout(function () {
						changeSendText('Send');
					}, 3000);
				},
				function (err) {
					changeSendText('Send');
					$scope.error = err;
				});
		};

		$scope.shareOnFacebook = function () {
			facebook.share({
				name: 'Just tried @likeastore it helps me to keep my favorites!',
				link: 'https://likeastore.com',
				picture: 'https://tour.likeastore.com/img/likeastore-feed-green.png',
				description: 'Wanna get all your favorites from different services organized?\n' +
					'Create collections of your favorites with useful content, Instagram photos, tweets, links, fonts, Dribbble shots and many more ' +
					'on https://likeastore.com ^.^',
				success: function () {
					$analytics.eventTrack('shared with friend', {via: 'facebook'});
					seismo.track('share-with-friend', {via: 'facebook'});
					mixpanel.people.increment('Shares with Friend', {via: 'facebook'});
				}
			});
		};

		$scope.shareOnTwitter = function () {
			$analytics.eventTrack('shared with friend', {via: 'twitter'});
			seismo.track('share-with-friend', {via: 'twitter'});
			mixpanel.people.increment('Shares with Friend', {via: 'twitter'});
		};

		function changeSendText(text) {
			$scope.sendText = text;
		}
	}

	return ShareWithFriendController;
});
