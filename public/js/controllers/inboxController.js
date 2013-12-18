define(function (require) {
	'use strict';

	function InboxController ($scope, $window, appLoader, api) {
		$window.scrollTo(0,0);

		$scope.title = 'Inbox';
		$scope.items = [];
		$scope.nextPage = false;

		loadPage();

		function createQuery () {
			var query = { resource: 'inbox' };

			return query;
		}

		function loadPage () {
			appLoader.loading();
			api.get(createQuery(), handleResults);
		}

		function handleResults (res) {
			$scope.items = $scope.items.concat(res.data);
			$scope.count = $scope.items.length;
			appLoader.ready();
		}

	}

	return InboxController;
});