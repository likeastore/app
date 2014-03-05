define(function () {
	'use strict';

	function TextSearch ($timeout, $window, $location, appLoader, api) {
		return {
			restrict: 'A',
			replace: true,
			template: '\
				<form ng-submit="goToSearch()" class="search-bar holder">\
					<i class="font-icon search-icon icon"></i>\
					<input type="text" name="text" class="search" placeholder="Search favorites" ng-model="query">\
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
				var timer;

				var $input = elem.find('input');
				$input.on('focus', function () {
					elem.addClass('active');
				});
				$input.on('blur', function () {
					elem.removeClass('active');
				});

				scope.$watch('query', searching, true);

				function searching (value) {
					if (timer) {
						$timeout.cancel(timer);
					}

					if (value) {
						timer = $timeout(function () {
							$location.url('/search?text=' + scope.query);
						}, delay);
					}
				}
			}
		};
	}

	return TextSearch;
});
