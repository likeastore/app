define(function (require) {
	'use strict';

	var angular = require('angular');
	var count;

	function InboxCounter(api) {
		return {
			restrict: 'E',
			link: function (scope, elem, attr) {
				if (!angular.isUndefined(count)) {
					elem.html('<span class="inbox-counter">' + format(count) + '</span>');
				} else {
					api.get({ resource: 'items', target: 'inbox', verb: 'count' }, function (res) {
						count = res.count;
						elem.html('<span class="inbox-counter">' + format(res.count) + '</span>');
					});
				}

				function format(count) {
					return count <= 1000 ? count : '1000 +';
				}
			}
		};
	}

	return InboxCounter;
});