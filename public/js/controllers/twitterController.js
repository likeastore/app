define(function (require) {
	'use strict';

	function TwitterController ($scope, api, appLoader) {
		appLoader.loading();

		$scope.limit = 30;
		$scope.increaseLimit = function () {
			$scope.limit += 30;
		};

		$scope.title = 'Twitter';
		$scope.items = api.query({ resource: 'items', target: 'twitter' }, function (res) {
			appLoader.ready();
		});
	}

	return TwitterController;
});