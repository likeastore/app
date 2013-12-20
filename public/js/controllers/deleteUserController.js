define(function () {
	'use strict';

	function DeleteUserController ($scope, auth, api) {
		$scope.deleteAccount = function () {
			api.remove({ resource: 'users', target: 'me' }, function () {
				auth.logout();
			});
		};
	}

	return DeleteUserController;
});