define(function (require) {
	'use strict';

	function SearchController ($scope, $rootScope, $routeParams, appLoader, api, user, $analytics, mixpanel) {
		$analytics.eventTrack('search opened');

		$rootScope.title = 'Search results for "' + $routeParams.text + '"';
		$scope.search = true;
		$scope.query = $routeParams.text;

		$scope.page = 1;
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

			api.get({ resource: 'search', text: $routeParams.text, page: $scope.page }, function (res) {
				$scope.items = $scope.items.concat(res.data);
				$scope.nextPage = res.nextPage;

				mixpanel.people.increment('Searches by Site');

				appLoader.ready();
			});
		}
	}

	return SearchController;
});
