define(function (require) {
	'use strict';

	var config = require('config').dashboard;

	function GithubController ($scope, $filter, items) {

		$scope.limit = config.limit;
		$scope.increaseLimit = function () {
			$scope.limit += config.limit;
		};

		$scope.title = 'Github';
		$scope.items = items;

		$scope.searching = function (query) {
			$scope.search = $filter('filter')($scope.items, query);
		};
	}

	GithubController.resolve = {
		items: function ($q, appLoader, api, auth) {
			var deferred = $q.defer();

			appLoader.loading();
			auth.checkAccessToken(function () {
				api.query({ resource: 'items', target: 'github' }, function (res) {
					appLoader.ready();
					deferred.resolve(res);
				});
			});

			return deferred.promise;
		}
	};

	return GithubController;
});