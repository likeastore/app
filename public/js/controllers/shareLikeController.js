define(function () {
	'use strict';

	function ShareLikeController ($scope, links) {
		$scope.link = links.share($scope.$parent.ngDialogData._id);
		$scope.title = $scope.$parent.ngDialogData.title || 'Like';
		$scope.service = $scope.$parent.ngDialogData.type;

		setTimeout(function () {
			document.getElementById('likeUrl').select();
		}, 100);
	}

	return ShareLikeController;
});