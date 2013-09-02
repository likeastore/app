define(function (require) {
	'use strict';

	function itemsControllerFactory (title, target) {
		var config = require('config').dashboard;

		function ItemsController($scope, appLoader, api) {
			$scope.title = title;
			$scope.page = 1;
			$scope.items = [];

			loadPage();

			$scope.showMore = function () {
				$scope.page += 1;
				loadPage();
			};

			function createQuery () {
				var query = { resource: 'items', page: $scope.page };
				if (target) {
					query.target = target;
				}

				return query;
			}

			function loadPage () {
				appLoader.loading();
				api.query(createQuery(), handleResults);
			}

			function handleResults (res) {
				$scope.items = $scope.items.concat(res.data);
				$scope.nextPage = res.nextPage;
				appLoader.ready();
			}
		}

		return ItemsController;
	}

	return itemsControllerFactory;
});