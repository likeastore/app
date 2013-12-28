define(function () {
	'use strict';

	function ShareLikeController ($scope, links) {
		$scope.link = links.share($scope.$parent.ngDialogData);

		setTimeout(function () {
			document.getElementById('likeUrl').select();
		}, 100);
	}

	return ShareLikeController;
});