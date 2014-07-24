define(function () {
	'use strict';

	function itemsControllerFactory (options) {

		function ItemsController($scope, $rootScope, $window, appLoader, api, user, $analytics) {
			$window.scrollTo(0,0);

			var resource = options.resource || 'items';
			var title = options.title;

			event && $analytics.eventTrack(event);

			$rootScope.title = options.title;

			$scope.page = 1;
			$scope.items = [];
			$scope.inbox = title === 'Inbox';
			$scope.types = {};

			loadPage();

			$scope.showMore = function () {
				$scope.page += 1;
				loadPage();
			};

			$scope.remove = function (id, index) {
				api.delete({ resource: resource, target: id }, function (res) {
					user.getInboxCount();
					$scope.items.splice(index, 1);
				});
			};

			$scope.markAsRead = function (id, index) {
				api.update({ resource: resource, target: id, verb: 'read' }, {}, function () {
					user.getInboxCount();
					$scope.items.splice(index, 1);
				});
			};

			function createQuery () {
				var query = { resource: resource, page: $scope.page };

				if (options.target) {
					query.target = options.target;
				}

				if (options.query) {
					query = _.extend(query, options.query);
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
