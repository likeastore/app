define(function () {
	'use strict';

	function ShareCollectionController ($scope, links) {
		var data = $scope.$parent.ngDialogData.split(', ');
		$scope.link = links.collection(data[0], data[1]);

		setTimeout(function () {
			document.getElementById('collectionUrl').select();
		}, 100);
	}

	return ShareCollectionController;
});