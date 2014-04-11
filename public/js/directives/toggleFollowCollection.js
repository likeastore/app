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
						ng-show="!mutual && !processing"\
						ng-click="followCollection()">Follow</button>\
					<button type="button" class="button sml-btn pink-btn slk-btn following-btn"\
						ng-show="mutual && !processing"\
						ng-click="unfollowCollection()">Unfollow</button>\
				</div>',
			controller: function ($scope, api) {
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
					api.update({ resource: 'collections', target: $scope.collectionId, verb: 'follow' }, {}, function () {
						$scope.mutual = true;
						$scope.processing = false;
						$rootScope.$emit('collection.follow', $scope.collectionId);
					});
				};

				$scope.unfollowCollection = function (id) {
					$scope.processing = true;

					api.delete({ resource: 'collections', target: $scope.collectionId, verb: 'follow' }, {}, function () {
						$scope.mutual = false;
						$scope.processing = false;
						$rootScope.$emit('collection.unfollow', $scope.collectionId);
					});
				};
			}
		};
	}

	return ToggleFollowCollection;
});
