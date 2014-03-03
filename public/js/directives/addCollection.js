define(function (require) {
	'use strict';

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
			controller: function ($scope, $rootScope, api) {
				$scope.colors = [
					{ name: 'red', hex: '#e74c3c' },
					{ name: 'orange', hex: '#f39c12' },
					{ name: 'yellow', hex: '#feee43' },
					{ name: 'green', hex: '#56c7aa' },
					{ name: 'blue', hex: '#3498db' },
					{ name: 'violet', hex: '#eab6fd' },
					{ name: 'grey', hex: '#c8c8c8' }
				];

				$scope.activeColor = $scope.colors[3];
				$scope.selectColor = function (color) {
					$scope.activeColor = color;
				};

				$scope.collection = {};

				$scope.createCollection = function () {
					$scope.collection.color = $scope.activeColor.hex;
					api.save({ resource: 'collections' }, $scope.collection, function (collection) {
						$rootScope.collections.push(collection);
						$scope.collection = {};
						$scope.showAddForm = false;
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
						$scope.showAddForm = true;
						$rootScope.showAddForm = false;
					}
				});
			}
		};
	}

	return AddCollection;
});
