define(function () {
	'use strict';

	function ToggleStateCollectionController ($scope, $location, user, ngDialog, api) {
		var data = $scope.$parent.ngDialogData.split(', ');
		var isPublic = (data[1] === 'true');

		$scope.futureState = !isPublic ? 'public' : 'private';
		$scope.stateText = !isPublic ?
			'This will make your collection visible and shareable to everyone.' :
			'This will make only you to have access to this collection.';

		$scope.toggleState = function () {
			api.patch({ resource: 'collections', target: data[0] }, { 'public': (isPublic ? false : true) }, function () {
				user.getCollections();
				ngDialog.close();
			});
		};

		$scope.goBack = function () {
			ngDialog.closeAll();
		};
	}

	return ToggleStateCollectionController;
});