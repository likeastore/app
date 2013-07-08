define(function (require) {
	'use strict';

	var config = require('config').dashboard;

	function TwitterController ($scope, $filter, items) {
		$scope.limit = config.limit;
		$scope.increaseLimit = function () {
			$scope.limit += config.limit;
		};

		$scope.title = 'Twitter';
		$scope.items = items;

		$scope.searching = function (query) {
			$scope.search = $filter('filter')($scope.items, query);
		};
	}

	TwitterController.resolve = {
		items: function ($q, appLoader, api, auth) {
			var deferred = $q.defer();

			appLoader.loading();
			auth.checkAccessToken(function () {
				api.query({ resource: 'items', target: 'twitter' }, function (res) {
					appLoader.ready();
					deferred.resolve(res);
				});
			});

			return deferred.promise;
		}
	};

	return TwitterController;
});