define(function () {
	'use strict';

	function ToggleStateCollectionController ($scope, ngDialog, api, user) {
		var data = $scope.$parent.ngDialogData.split(', ');
		var collectionId = data[0];
		var isPublic = (data[1] === 'true');

		$scope.futureState = !isPublic ? 'public' : 'private';
		$scope.stateText = !isPublic ?
			'This will make your collection visible and shareable to everyone.' :
			'This will make only you to have access to this collection.';

		$scope.toggleState = function () {
			api.patch({ resource: 'collections', target: collectionId }, { 'public': (isPublic ? false : true) }, function () {
				$scope.$emit('update collection', collectionId);
				ngDialog.close();
			});
		};

		$scope.goBack = function () {
			ngDialog.closeAll();
		};
	}

	return ToggleStateCollectionController;
});
