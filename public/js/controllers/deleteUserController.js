define(function () {
	'use strict';

	function DeleteUserController ($scope, auth, ngDialog, api) {
		$scope.deleteAccount = function () {
			api.remove({ resource: 'users', target: 'me' }, function () {
				auth.logout();
			});
		};

		$scope.goBack = function () {
			ngDialog.closeAll();
		};
	}

	return DeleteUserController;
});