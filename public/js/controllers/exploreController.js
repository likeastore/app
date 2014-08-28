define(function () {
	'use strict';

	function ExploreController($scope, $rootScope, $timeout, api, appLoader, $analytics) {
		$analytics.eventTrack('explore opened');

		$rootScope.title = 'Explore collections';
		$scope.list = 'explore';

		getPopularCollections();

		var timer;
		$scope.$watch('searchTags', searching, true);

		function searching(tags) {
			if (timer) {
				$timeout.cancel(timer);
			}

			if (tags) {
				timer = $timeout(function () {
					searchForCollections(tags);
				}, 1000);
			} else if ($rootScope.loaded) {
				getPopularCollections();
			}
		}

		$scope.$on('follow.collection', function (event, collId) {
			var targetCollection = _(event.currentScope.colls).find(function (row) {
				return row._id === collId;
			});
			targetCollection.followersCount += 1;
		});

		$scope.$on('unfollow.collection', function (event, collId) {
			var targetCollection = _(event.currentScope.colls).find(function (row) {
				return row._id === collId;
			});
			targetCollection.followersCount -= 1;
		});

		function getPopularCollections() {
			appLoader.loading();

			api.query({ resource: 'collections', target: 'explore' }, function (collections) {
				_(collections).each(function (collection) {
					collection.owned = _($rootScope.collections).find(checkMutual);
					function checkMutual(row) {
						return row._id === collection._id;
					}
				});

				$scope.colls = collections;
				$scope.searching = false;

				appLoader.ready();
			});
		}

		function searchForCollections(searchTags) {
			appLoader.loading();

			$analytics.eventTrack('collections searched');

			api.get({ resource: 'search', target: 'collections', text: searchTags }, function (res) {
				$scope.colls = res.data;
				$scope.nextPage = res.nextPage;
				$scope.searching = true;

				appLoader.ready();
			});
		}
	}

	return ExploreController;
});
