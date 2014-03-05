define(function (require) {
	'use strict';

	var angular = require('angular');
	var $el = angular.element;

	function EditCollection ($document, api, user, $rootScope, _) {
		return {
			restrict: 'A',
			template: '\
				<div class="color-avatar show-edit" style="background-color: {{collection.color || \'#56c7aa\'}}"></div>\
				<h2 class="title show-edit" ng-click="showEditPopup(\'titleEditMode\', $event)">\
					{{collection.title|truncate:60}}\
					<div ng-class="{active: titleEditMode}" class="edit-collection-popup title-mode">\
						<input class="fld" type="text" ng-model="updatedColl.title" maxlength="60">\
						<a href="" class="link-btn cancel left" ng-click="cancelCollection(\'titleEditMode\')">Cancel</a>\
						<button type="button" class="btn green-btn right" ng-click="updateCollection(\'title\')">Save</button>\
					</div>\
				</h2>\
				<div class="description show-edit" ng-click="showEditPopup(\'descriptionEditMode\', $event)"\
					ng-class="{block: collection.description.length > 60}">\
					{{collection.description || \'No description\'|truncate:140}}\
					<div ng-class="{active: descriptionEditMode}" class="edit-collection-popup description-mode">\
						<textarea class="fld" ng-model="updatedColl.description" rows="5" maxlength="140"></textarea>\
						<a href="" class="link-btn cancel left" ng-click="cancelCollection(\'descriptionEditMode\')">Cancel</a>\
						<button type="button" class="btn green-btn right" ng-click="updateCollection(\'description\')">Save</button>\
					</div>\
				</div>',
			link: function ($scope, elem, attrs) {
				$scope.updatedColl = {};

				$scope.showEditPopup = function (mode, e) {
					$scope.updatedColl = angular.copy($scope.collection);
					$scope.titleEditMode = false;
					$scope.descriptionEditMode = false;
					$scope[mode] = true;
				};

				$scope.updateCollection = function (prop) {
					var data = {};
					data[prop] = $scope.updatedColl[prop];

					api.patch({ resource: 'collections', target: $scope.collection._id }, data, function (res) {
						$scope.titleEditMode = false;
						$scope.descriptionEditMode = false;

						user.getCollections();
					});
				};

				$scope.cancelCollection = function (mode) {
					$scope[mode] = false;
				};

				$document.on('click', function (e) {
					var $target = $el(e.target);
					var clickable = $target.hasClass('show-edit') || checkPopup($target);

					if (!clickable) {
						$scope.titleEditMode = false;
						$scope.descriptionEditMode = false;
						$scope.$apply();
					}

					function checkPopup (elem) {
						return (elem.hasClass('edit-collection-popup') || elem.parent().hasClass('edit-collection-popup') && !elem.hasClass('cancel'));
					}
				});
			}
		};
	}


	return EditCollection;
});
