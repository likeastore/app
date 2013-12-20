define(function () {
	'use strict';

	function ShareWithFriendController($rootScope, $scope, api, dialog) {
		$scope.message = '\
Want to share Likeastore with you. It helps me to connect to all my social networks, like twitter and facebook and keep all my interests in one place.\
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

			api.save({resource: 'emails', target: 'share'}, payload, function (res) {
				dialog.close();
			});
		};
	}

	return ShareWithFriendController;
});