define(function () {
	'use strict';

	function ShareWithFriendController($rootScope, $scope, $timeout, api, analytics) {
		$scope.sendText = 'Send';
		$scope.message = '\
I want to share Likeastore with you. It helps me to connect to all my social networks, like twitter and facebook and keep all my interests in one place.\
\n\n\
https://likeastore.com';

		$scope.send = function () {
			var user = $rootScope.user;
			var email = $scope.email;
			var message = $scope.message;

			var payload = {
				to: email,
				from: user.email,
				username: user.displayName || user.username,
				message: message
			};

			changeSendText('Sending');
			api.save({resource: 'emails', target: 'share'}, payload,
				function (res) {
					$scope.email = '';
					changeSendText('Thank you!');
					analytics.track('share-with-friend', {via: 'email'});

					$timeout(function () {
						changeSendText('Send');
					}, 3000);
				},
				function (err) {
					changeSendText('Send');
					$scope.error = err;
				});
		};

		function changeSendText(text) {
			$scope.sendText = text;
		}
	}

	return ShareWithFriendController;
});