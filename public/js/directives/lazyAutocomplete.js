define(function (require) {
	'use strict';

	var $el = require('angular').element;
	var tmpl = '<ul class="lazy-autocomplete" ng-if="results.length">\
					<li ng-repeat="result in results" class="lazy-autocomplete-item" ng-class="{\'last\': $last}">\
						<a href="/u/{{result.name}}" class="mask-link"></a>\
						<img ng-src="{{result.avatar}}" class="avatar" avatar-load>\
						<span class="name truncate">{{result.displayName || result.name}}</span>\
					</li>\
				</ul>';

	function LazyAutocomplete ($compile, $timeout, $document, api) {
		return {
			restrict: 'A',
			controller: function ($scope) {
				var timer;

				$scope.$watch('searchTag', function (value) {
					$scope.results = [];
					if (timer) {
						$timeout.cancel(timer);
					}

					if (value) {
						timer = $timeout(function () {
							$scope.results = api.query({ resource: 'users', target: 'search', name: $scope.searchTag });
						}, 500);
					}
				});
			},
			compile: function (element) {
				element.addClass('lazy-autocomplete-input');
				element.after(tmpl);

				return function (scope, elem, attrs) {
					$document.bind('click', function (e) {
						var isInput = $el(e.target).hasClass('lazy-autocomplete-input');
						var isAutocomplete = $el(e.target).hasClass('lazy-autocomplete-item');

						if (isInput || isAutocomplete) {
							return;
						}

						closeAutocomplete();
					});

					$document.bind('keyup', function (e) {
						if (e.keyCode === 27) {
							closeAutocomplete();
						}
					});

					function closeAutocomplete () {
						scope.searchTag = null;
						scope.results = [];
						scope.$apply();
					}
				};
			}
		};
	}

	return LazyAutocomplete;
});