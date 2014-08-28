/**
 * Updated directive initially of "addCollectionPopup.js"
 */

define(function (require) {
	'use strict';

	function StoreToCollectionPopup () {
		return {
			restrict: 'A',
			scope: {
				item: "=storeIt"
			},
			template: '\
				<a href="" class="store-it-btn" ng-click="togglePopup()">\
					<i class="font-icon plus-icon icon" ng-class="{\'check-icon animated bounceIn\': added}"></i> Add to\
				</a>\
				<ul class="show-coll-popup" ng-class="{\'on\': popup}" ng-mouseleave="popup=false">\
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
				</ul>',
			controller: function ($scope, $rootScope, $document, $analytics, $timeout, api, seismo) {
				$rootScope.watch('collections', function (collections) {
					$scope.collections = collections;

					$scope.togglePopup = function () {
						$scope.popup = !$scope.popup ? true : false;
					};

					$scope.addItemToCollection = function (collectionId) {
						$scope.added = true;
						$timeout(function () {
							$scope.added = false;
						}, 1500);

						api.update({
							resource: 'collections',
							target: collectionId,
							verb: 'items',
							suffix: $scope.item._id
						}, {}, function (res) {
							$analytics.eventTrack('collection item added');
							seismo.track('collection item added');
						});
					};

					$scope.createFirstCollection = function () {
						$document.find('body').addClass('sidebar-active');
						$rootScope.showAddForm = true;
					};
				});
			},
			link: function (scope, elem) {
				elem.addClass('store-it-popup-wrap');
			}
		};
	}

	return StoreToCollectionPopup;
});
