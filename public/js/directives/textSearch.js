define(function () {
	'use strict';

	var angular = require('angular');

	function TextSearch ($timeout, $window, api) {
		return {
			restrict: 'A',
			template: '\
				<i data-icon="i" class="search-icon"></i>\
				<input type="text" class="search-input" name="search" placeholder="Search" ng-model="query">\
				<div class="hover-background"></div>\
			',
			link: function (scope, elem, attrs) {
				var delay = attrs.delay || 1000;
				var timer = false;
				var backup;

				scope.$watch('query', searching);

				function searching (value) {
					if (timer) {
						$timeout.cancel(timer);
					}

					timer = $timeout(function () {
						if (value) {
							$window.scrollTo(0,0);
							makeItemsBackupOnce();
							scope.items = api.query({ resource: 'search', text: value });
							scope.search = true;
						} else if (backup) {
							scope.items = scope.backup;
							scope.search = false;
						}
					}, delay);
				}

				function makeItemsBackupOnce () {
					if (!backup) {
						scope.backup = angular.copy(scope.items);
						backup = true;
					}
				}
			}
		};
	}

	return TextSearch;
});