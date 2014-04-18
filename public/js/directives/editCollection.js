define(function (require) {
	'use strict';

	var config = require('config');
	var angular = require('angular');

	function EditCollection (api, user) {
		return {
			restrict: 'A',
			template: '\
				<h2 class="featured-title show-edit">\
					<div class="color-avatar-current show-edit" style="background-color: {{collection.color || \'#56c7aa\'}}"\
						ng-click="showEditPopup(\'colorEditMode\', $event)">\
						<div ng-class="{active: modes.colorEditMode}" class="edit-collection-popup add-coll-form title-mode">\
							<div class="colors">\
								<span ng-repeat="color in colors" class="color-avatar" style="background: {{color.hex}};"\
									ng-click="selectColor(color)"\
									ng-class="{active: activeColor.name === color.name, last: $last}"></span>\
							</div>\
							<a href="" class="link-btn cancel left" ng-click="cancelCollection(\'colorEditMode\', $event)">Cancel</a>\
							<button type="button" class="button green-btn mdm-btn right" ng-click="updateCollection(\'color\')">Save</button>\
						</div>\
					</div>\
					<span class="actual-content" ng-click="showEditPopup(\'titleEditMode\', $event)">{{collection.title|truncate:60}}</span>\
					<div ng-class="{active: modes.titleEditMode}" class="edit-collection-popup title-mode">\
						<input class="field" type="text" ng-model="updatedColl.title" placeholder="Collection title is required" maxlength="60">\
						<a href="" class="link-btn cancel left" ng-click="cancelCollection(\'titleEditMode\', $event)">Cancel</a>\
						<button type="button" class="button green-btn mdm-btn right" ng-click="updateCollection(\'title\')">Save</button>\
					</div>\
				</h2>\
				<div class="featured-description show-edit"\
					ng-class="{block: collection.description.length > 60}">\
					<span class="actual-content" ng-click="showEditPopup(\'descriptionEditMode\', $event)"\
						ng-bind-html="collection.description || \'Empty description\'|truncate:200"></span>\
					<div ng-class="{active: modes.descriptionEditMode}" class="edit-collection-popup description-mode">\
						<textarea class="field" ng-model="updatedColl.description" placeholder="Add description for your awesome collection" rows="5" maxlength="200"></textarea>\
						<a href="" class="link-btn cancel left" ng-click="cancelCollection(\'descriptionEditMode\', $event)">Cancel</a>\
						<button type="button" class="button green-btn mdm-btn right" ng-click="updateCollection(\'description\')">Save</button>\
					</div>\
				</div>',
			link: function ($scope, elem, attrs) {
				$scope.colors = config.colors;

				$scope.activeColor = _($scope.colors).find(function (color) {
					return color.hex === $scope.collection.color;
				});
				$scope.selectColor = function (color) {
					$scope.activeColor = color;
				};

				$scope.modes = {};
				$scope.updatedColl;

				$scope.showEditPopup = function (mode, $event) {
					$scope.updatedColl = angular.copy($scope.collection);
					disableAllModes();
					$scope.modes[mode] = true;
				};

				$scope.updateCollection = function (prop) {
					var data = {};

					if (prop === 'color') {
						data.color = $scope.activeColor.hex;
					} else {
						data[prop] = $scope.updatedColl[prop];
					}

					if (prop === 'title' && !data[prop]) {
						return;
					}

					api.patch({ resource: 'collections', target: $scope.collection._id }, data, function (res) {
						disableAllModes();
						$scope.$emit('update collection', $scope.collection._id);
					});
				};

				$scope.cancelCollection = function (mode, $event) {
					$event.stopImmediatePropagation();
					$scope.modes[mode] = false;
				};

				function disableAllModes() {
					for (var mode in $scope.modes) {
						$scope.modes[mode] = false;
					}
				}
			}
		};
	}

	return EditCollection;
});
