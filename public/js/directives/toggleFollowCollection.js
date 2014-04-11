define(function (require) {
	'use strict';

	function ToggleFollowCollection ($rootScope) {
		return {
			restrict: 'A',
			scope: {
				collectionId: "=toggleFollowCollection"
			},
			replace: true,
			template: '\
				<div class="follow-collection">\
					<button type="button" class="button sml-btn navy-btn slk-btn follow-btn"\
						ng-show="!mutual"\
						ng-click="followCollection()"\
						ng-disabled="processing">Follow</button>\
					<button type="button" class="button sml-btn pink-btn slk-btn following-btn"\
						ng-show="mutual"\
						ng-click="unfollowCollection()"\
						ng-disabled="processing">Unfollow</button>\
				</div>',
			controller: function ($scope, api, $analytics) {
				$scope.$watch('collectionId', function (value) {
					if (!value) {
						return;
					}
					$scope.mutual = _($rootScope.user.followCollections).find(function (row) {
						return row.id === $scope.collectionId;
					});
				});

				$scope.followCollection = function () {
					$scope.processing = true;

					$analytics.eventTrack('collection followed');

					api.update({ resource: 'collections', target: $scope.collectionId, verb: 'follow' }, {}, function () {
						$scope.mutual = true;
						$scope.processing = false;
						$rootScope.$broadcast('follow.collection', $scope.collectionId);
					});
				};

				$scope.unfollowCollection = function (id) {
					$scope.processing = true;

					$analytics.eventTrack('collection unfollowed');

					api.delete({ resource: 'collections', target: $scope.collectionId, verb: 'follow' }, {}, function () {
						$scope.mutual = false;
						$scope.processing = false;
						$rootScope.$broadcast('unfollow.collection', $scope.collectionId);
					});
				};
			}
		};
	}

	return ToggleFollowCollection;
});
