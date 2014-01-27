define(function () {
	'use strict';

	function itemsControllerFactory (title, target, event, resource) {

		function ItemsController($scope, $rootScope, $window, appLoader, api, user, $analytics) {
			$window.scrollTo(0,0);

			resource = resource || 'items';

			event && $analytics.eventTrack(event);

			$rootScope.title = title;
			$scope.page = 1;
			$scope.items = [];
			$scope.inbox = title === 'Inbox';

			loadPage();

			$scope.showMore = function () {
				$scope.page += 1;
				loadPage();
			};

			$scope.hideLike = function (id, index) {
				api.delete({ resource: resource, target: id }, function (res) {
					user.getInboxCount();
					$scope.items.splice(index, 1);
				});
			};

			function createQuery () {
				var query = { resource: resource, page: $scope.page };
				if (target) {
					query.target = target;
				}

				return query;
			}

			function loadPage () {
				appLoader.loading();
				api.get(createQuery(), handleResults);
			}

			function handleResults (res) {
				$scope.items = $scope.items.concat(res.data);
				$scope.nextPage = res.nextPage;
				if (title === 'Inbox') {
					$scope.count = $scope.items.length;
				}
				appLoader.ready();
			}
		}

		return ItemsController;
	}

	return itemsControllerFactory;
});