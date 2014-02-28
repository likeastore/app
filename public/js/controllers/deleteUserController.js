define(function () {
	'use strict';

	function DeleteUserController ($scope, auth, ngDialog, api, tracking) {
		$scope.deleteAccount = function () {
			api.remove({ resource: 'users', target: 'me' }, function () {
				auth.logout();
				tracking.deleteAccount();
			});
		};

		$scope.goBack = function () {
			ngDialog.closeAll();
		};
	}

	return DeleteUserController;
});