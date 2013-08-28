define(function () {
	'use strict';

	var angular = require('angular');

	function TextSearch ($timeout, $window, appLoader, api) {
		return {
			restrict: 'A',
			replace: true,
			template: '\
				<div class="search-bar-wrap">\
					<i data-icon="i" class="search-icon"></i>\
					<input type="text" class="search-input" name="search" placeholder="Search" ng-model="query">\
					<div class="hover-background"></div>\
				</div>\
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
							scope.search = true;

							appLoader.loading();

							scope.items = api.query({ resource: 'search', text: value }, function (res) {
								appLoader.ready();
							});
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