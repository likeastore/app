define(function (require) {
	'use strict';

	function ToggleFollowCollection ($compile) {
		return {
			restrict: 'A',
			scope: {
				collectionId: "=toggleFollowCollection"
			},
			replace: true,
			controller: function ($scope, $rootScope, api, $analytics) {
				$scope.$watch('collectionId', function (value) {
					if (!value) {
						return;
					}

					$scope.following = _($rootScope.user.followCollections).find(function (row) {
						return row.id === $scope.collectionId;
					});

					$scope.owning = _($rootScope.collections).find(function (row) {
						return row._id === $scope.collectionId;
					});
				});

				$scope.followCollection = function () {
					$scope.processing = true;

					$analytics.eventTrack('collection followed');

					api.update({ resource: 'collections', target: $scope.collectionId, verb: 'follow' }, {}, function () {
						$scope.following = true;
						$scope.processing = false;
						$rootScope.$broadcast('follow.collection', $scope.collectionId);
					});
				};

				$scope.unfollowCollection = function (id) {
					$scope.processing = true;

					$analytics.eventTrack('collection unfollowed');

					api.delete({ resource: 'collections', target: $scope.collectionId, verb: 'follow' }, {}, function () {
						$scope.following = false;
						$scope.processing = false;
						$rootScope.$broadcast('unfollow.collection', $scope.collectionId);
					});
				};
			},
			link: function (scope, elem, attrs) {
				var templates = {
					'default': '\
						<div class="follow-collection">\
							<a ng-show="owning" ng-href="/collections/{{collectionId}}" class="button sml-btn blue-btn slk-btn edit-btn">View</a>\
							<button type="button" class="button sml-btn navy-btn slk-btn follow-btn"\
								ng-show="!following"\
								ng-click="followCollection()"\
								ng-disabled="processing">Follow</button>\
							<button type="button" class="button sml-btn pink-btn slk-btn following-btn"\
								ng-show="following"\
								ng-click="unfollowCollection()"\
								ng-disabled="processing">Unfollow</button>\
						</div>',
					'icons': '\
						<div class="follow-collection follow-collection-icons">\
							<button class="button orange-btn follow-icon-btn"\
								ng-show="!following"\
								ng-click="followCollection()"\
								ng-disabled="processing"><i class="font-icon plus-icon"></i></button>\
							<button class="button navy-btn following-icon-btn"\
								ng-show="following"\
								ng-click="unfollowCollection()"\
								ng-disabled="processing"><i class="font-icon check-icon"></i></button>\
						</div>'
				};

				var activeTmpl = attrs.toggleFollowCollectionTmpl || 'default';
				var tmplObj = $compile(templates[activeTmpl])(scope);

				elem.append(tmplObj);
			}
		};
	}

	return ToggleFollowCollection;
});
