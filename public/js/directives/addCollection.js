define(function (require) {
	'use strict';

	var config = require('config');

	function AddCollection () {
		return {
			restrict: 'A',
			scope: {},
			template: '\
				<div class="show-form" ng-click="showForm()"><i class="font-icon add-circle-icon icon"></i> New collection</div>\
				<form ng-submit="createCollection()" ng-class="{on: showAddForm}" class="add-coll-form" novalidate autocomplete="off">\
					<div class="colors">\
						<span ng-repeat="color in colors" class="color-avatar" style="background: {{color.hex}};"\
							ng-click="selectColor(color)"\
							ng-class="{active: activeColor.name === color.name}"></span>\
					</div>\
					<div>\
						<input type="text" class="coll-title fld" placeholder="Title" ng-model="collection.title" maxlength="60">\
					</div>\
					<div>\
						<textarea class="coll-desc fld" placeholder="Description" ng-model="collection.description" rows="3" maxlength="140"></textarea>\
					</div>\
					<div>\
						<input type="checkbox" ng-model="collection.public">\
						<label>\
							Public access\
							<i class="font-icon help-icon icon" tooltip="Your collection will be visible for everyone."></i>\
						</label>\
					</div>\
					<div class="buttons">\
						<div ng-click="createCollection()" class="link-btn add">Create</div>\
						<div ng-click="closeForm()" class="link-btn cancel">Cancel</div>\
					</div>\
				</form>',
			controller: function ($scope, $rootScope, $cookieStore, $analytics, seismo, api, ngDialog, user) {
				$scope.colors = config.colors;

				$scope.activeColor = $scope.colors[3];
				$scope.selectColor = function (color) {
					$scope.activeColor = color;
				};

				$scope.collection = config.defaultCollectionProps;

				$scope.createCollection = function () {
					$scope.collection.color = $scope.activeColor.hex;

					api.save({ resource: 'collections' }, $scope.collection, function (collection) {
						$analytics.eventTrack('collection created');
						seismo.track('collection created');

						var getBadge = $rootScope.collections.length === 0 && !$cookieStore.get('hypebeastBadge');

						$scope.$parent.showCollections = true;
						$rootScope.collections.push(collection);

						$scope.collection = config.defaultCollectionProps;
						$scope.closeForm();

						if (getBadge) {
							ngDialog.open({
								className: 'lsd-theme badge-dialog share-dialog',
								template: 'shareFirstCollectionCreatedDialog',
								controller: 'shareFirstCollectionCreatedController',
								data: collection._id,
								showClose: false
							});
						}

						$rootScope.$broadcast('collection added', collection);
					});
				};

				$scope.showForm = function () {
					$scope.showAddForm = true;
				};

				$scope.closeForm = function () {
					$scope.showAddForm = false;
				};

				$rootScope.$watch('showAddForm', function (value) {
					if (value) {
						$scope.showForm();
						$rootScope.showAddForm = false;
					}
				});
			}
		};
	}

	return AddCollection;
});
