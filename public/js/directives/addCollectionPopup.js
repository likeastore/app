define(function (require) {
	'use strict';

	function AddCollectionPopup () {
		return {
			restrict: 'A',
			scope: {
				itemId: "=addCollectionPopup"
			},
			replace: true,
			template: '\
				<a href="" class="addto-btn" tooltip="Collect">\
					<i class="font-icon addto-icon" ng-class="{\'added-icon animated bounce\': added}"></i>\
					<ul class="show-coll-popup">\
						<li class="show-coll-item truncate"\
							ng-repeat="collection in collections"\
							ng-click="addItemToCollection(collection._id)">\
							<span style="background: {{collection.color || \'#56c7aa\'}}" class="color-avatar"></span>\
							<span>{{collection.title}}</span>\
						</li>\
					</ul>\
				</a>',
			controller: function ($scope, $rootScope, $timeout, api) {
				$scope.collections = $rootScope.collections;
				$scope.togglePopup = function () {
					$scope.popup = !$scope.popup ? true : false;
				};

				$scope.addItemToCollection = function (collId) {
					api.update({
						resource: 'collections',
						target: collId,
						verb: 'item',
						suffix: $scope.itemId
					}, {}, function (res) {
						$scope.added = true;
						$timeout(function () {
							$scope.added = false;
						}, 2000);
					});
				};
			}
		};
	}

	return AddCollectionPopup;
});
