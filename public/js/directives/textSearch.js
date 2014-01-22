define(function () {
	'use strict';

	var angular = require('angular');

	function TextSearch ($timeout, $window, $location, appLoader, api) {
		return {
			restrict: 'A',
			replace: true,
			template: '\
				<form ng-submit="goToSearch()" class="search-bar-wrap">\
					<i data-icon="P" class="search-icon"></i>\
					<input type="text" class="search-input" name="text" placeholder="SEARCH" ng-model="query">\
					<div class="hover-background"></div>\
				</form>\
			',
			controller: function ($scope) {
				$scope.goToSearch = function () {
					if (!$scope.query) {
						return;
					}
					$location.url('/search?text=' + $scope.query);
				};
			},
			link: function (scope, elem, attrs) {
				var delay = attrs.delay || 1000;
				var parentScope = scope.$parent;
				var timer = false;
				var backup, pages;

				scope.$watch('query', searching, true);

				function searching (value) {
					if (timer) {
						$timeout.cancel(timer);
					}

					if (value) {
						timer = $timeout(function () {
							$window.scrollTo(0,0);

							parentScope.search = true;
							makeItemsBackupOnce();
							appLoader.loading();

							api.get({ resource: 'search', text: value }, function (res) {
								parentScope.items = res.data;
								parentScope.nextPage = res.nextPage;
								appLoader.ready();
							});
						}, delay);
					} else if (backup) {
						parentScope.items = scope.backup;
						parentScope.nextPage = pages;
						parentScope.search = false;
					}
				}

				function makeItemsBackupOnce () {
					if (!backup) {
						parentScope.backup = angular.copy(parentScope.items);
						pages = parentScope.nextPage;
						backup = true;
					}
				}
			}
		};
	}

	return TextSearch;
});
