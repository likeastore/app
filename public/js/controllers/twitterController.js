define(function (require) {
	'use strict';

	function TwitterController ($scope, api, appLoader) {
		appLoader.loading();

		$scope.title = 'Twitter';
		$scope.items = api.query({ resource: 'items', target: 'twitter' }, function (res) {
			appLoader.ready();
		});
	}

	return TwitterController;
});