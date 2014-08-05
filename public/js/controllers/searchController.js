define(function (require) {
	'use strict';

	function SearchController ($scope, $rootScope, $routeParams, appLoader, api, user, $analytics, mixpanel) {
		$analytics.eventTrack('search opened');

		$scope.search = true;
		$scope.query = $routeParams.text;

		$scope.page = 1;
		$scope.collections = [];
		$scope.feeds = [];
		$scope.items = [];
		$scope.nextPage = false;

		loadPage();

		$scope.showMore = function () {
			$scope.page += 1;
			loadPage();
		};

		$scope.remove = function (id, index) {
			api.delete({ resource: 'items', target: id }, function (res) {
				user.getInboxCount();
				$scope.items.splice(index, 1);
			});
		};

		function loadPage() {
			appLoader.loading();

			// TODO: extend query with tracking

			api.get({ resource: 'search2', text: $routeParams.text, page: $scope.page }, function (res) {
				if ($scope.page === 1) {
					$scope.collections = $scope.collections.concat(res.collections.data);
					$scope.feeds = $scope.feeds.concat(res.feeds.data);
				}

				$scope.items = $scope.items.concat(res.items.data);
				$scope.nextPage = res.items.data.nextPage;

				mixpanel.people.increment('Searches by Site');

				appLoader.ready();
			});
		}
	}

	return SearchController;
});
