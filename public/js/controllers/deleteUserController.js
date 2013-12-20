define(function () {
	'use strict';

	function DeleteUserController ($scope, auth, dialog, api) {
		$scope.deleteAccount = function () {
			api.remove({ resource: 'users', target: 'me' }, function () {
				auth.logout();
			});
		};

		$scope.goBack = function () {
			dialog.close();
		};
	}

	return DeleteUserController;
});