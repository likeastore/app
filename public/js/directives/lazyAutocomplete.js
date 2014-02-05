define(function (require) {
	'use strict';

	var tmpl = '\
		<ul class="lazy-autocomplete" ng-if="results.length">\
			<li ng-repeat="result in results" class="lazy-autocomplete-item" ng-class="{\'last\': $last}">\
				<a href="/u/{{result.name}}" class="mask-link"></a>\
				<img ng-src="{{result.avatar}}" class="avatar" avatar-load> <span class="name">{{result.displayName || result.name}}</span>\
			</li>\
		</ul>';

	function LazyAutocomplete ($timeout, api) {
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
			compile: function (elem) {
				elem.after(tmpl);
			}
		};
	}

	return LazyAutocomplete;
});