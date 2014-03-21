define(function () {
	'use strict';

	function ShareCollectionController ($scope, $window, $rootScope) {
		$scope.link = $window.appConfig.siteUrl + '/u/' + $rootScope.user.name + '/' + $scope.$parent.ngDialogData;

		setTimeout(function () {
			document.getElementById('collectionUrl').select();
		}, 100);
	}

	return ShareCollectionController;
});