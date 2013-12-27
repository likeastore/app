define(function () {
	'use strict';

	function ShareLikeController ($scope, links, ngDialog) {
		$scope.link = links.share($scope.$parent.ngDialogData);

	}

	return ShareLikeController;
});