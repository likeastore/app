define(function (require) {
	'use strict';

	var config = require('config').dashboard;

	function DashboardController ($scope, $filter, items) {
		$scope.limit = config.limit;
		$scope.increaseLimit = function () {
			$scope.limit += config.limit;
		};

		$scope.title = 'Inbox';
		$scope.items = items;

		$scope.searching = function (query) {
			$scope.search = $filter('filter')($scope.items, query);
		};
	}

	DashboardController.resolve = {
		items: function ($q, appLoader, api, auth) {
			var deferred = $q.defer();

			appLoader.loading();
			auth.checkAccessToken(function () {
				api.query({ resource: 'items' }, function (res) {
					appLoader.ready();
					deferred.resolve(res);
				});
			});

			return deferred.promise;
		}
	};

	return DashboardController;
});