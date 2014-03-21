define(function () {
	'use strict';

	function ShareCollectionController ($scope, links) {
		$scope.link = links.collection($scope.$parent.ngDialogData);

		setTimeout(function () {
			document.getElementById('collectionUrl').select();
		}, 100);
	}

	return ShareCollectionController;
});