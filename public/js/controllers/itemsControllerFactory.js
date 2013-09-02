define(function (require) {
	'use strict';

	function itemsControllerFactory (title, target) {

		var config = require('config').dashboard;

		function ItemsController($scope, appLoader, api) {
			appLoader.loading();

			$scope.page = 1;
			$scope.haveMore = true;
			$scope.items = [];

			$scope.showMore = function () {
				appLoader.loading();
				$scope.page += 1;
				api.query(createQuery(), function (res) {
					$scope.items = $scope.items.concat(res);
					$scope.haveMore = res.length === config.limit;
					appLoader.ready();
				});

			};

			$scope.title = title;
			api.query(createQuery(), function (res) {
				$scope.items = res;
				appLoader.ready();
			});

			function createQuery () {
				var query = { resource: 'items', page: $scope.page };
				if (target) {
					query.target = target;
				}

				return query;
			}
		}

		return ItemsController;
	}

	return itemsControllerFactory;
});