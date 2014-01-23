define(function (require) {
	'use strict';

	function InboxCounter(api, $location) {
		return {
			restrict: 'E',
			template: '<span class="inbox-counter" ng-hide="count === 0">{{count}}</span>',
			link: function (scope, elem, attr) {
				api.cacheGet({ resource: 'items', target: 'inbox', verb: 'count' }, function (res) {
					scope.count = format(res.count);
				});

				function format(count) {
					return count <= 1000 ? count : '1000 +';
				}
			}
		};
	}

	return InboxCounter;
});