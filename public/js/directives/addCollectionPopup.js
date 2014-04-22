define(function (require) {
	'use strict';

	function AddCollectionPopup () {
		return {
			restrict: 'A',
			scope: {
				item: "=addCollectionPopup"
			},
			replace: true,
			template: '\
				<a href="" class="addto-btn" tooltip="Add to collection">\
					<i class="font-icon addto-icon" ng-class="{\'added-icon animated bounce\': added}"></i>\
					<ul class="show-coll-popup" ng-mouseleave="popup=false">\
						<li class="show-coll-item show-coll-empty"\
							ng-if="!collections.length">\
							<div class="text">No collections</div>\
							<button type="button" class="btn small-btn gradient-btn" ng-click="createFirstCollection()">Create one</button>\
						</li>\
						<li class="show-coll-item truncate"\
							ng-repeat="collection in collections"\
							ng-class="{active: itemId === collection._id}"\
							ng-click="addItemToCollection(collection._id)">\
							<span style="background: {{collection.color || \'#56c7aa\'}}" class="color-avatar"></span>\
							<span>{{collection.title}}</span>\
						</li>\
					</ul>\
				</a>',
			controller: function ($scope, $rootScope, $document, $analytics, $timeout, api) {
				$scope.collections = $rootScope.collections;

				$scope.togglePopup = function () {
					$scope.popup = !$scope.popup ? true : false;
				};

				$scope.addItemToCollection = function (collId) {
					$scope.added = true;
					$timeout(function () {
						$scope.added = false;
					}, 1500);

					api.update({
						resource: 'collections',
						target: collId,
						verb: 'items',
						suffix: $scope.item._id
					}, {}, function (res) {
						$analytics.eventTrack('collection item added');
					});
				};

				$scope.createFirstCollection = function () {
					$document.find('body').addClass('sidebar-active');
					$rootScope.showAddForm = true;
				};
			}
		};
	}

	return AddCollectionPopup;
});
