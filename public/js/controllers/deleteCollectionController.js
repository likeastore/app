define(function () {
	'use strict';

	function DeleteCollectionController ($scope, $location, user, ngDialog, api) {
		$scope.deleteCollection = function () {
			api.remove({ resource: 'collections', target: $scope.$parent.ngDialogData }, function () {
				user.getCollections();
				ngDialog.close();
				$location.url('/');
			});
		};

		$scope.goBack = function () {
			ngDialog.closeAll();
		};
	}

	return DeleteCollectionController;
});
