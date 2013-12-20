define(function (require) {
	'use strict';

	var angular = require('angular');
	var countSession;

	function InboxCounter(api) {
		return {
			restrict: 'E',
			link: function (scope, elem, attr) {
				if (!angular.isUndefined(countSession)) {
					elem.html(format(countSession));
				} else {
					api.get({ resource: 'items', target: 'inbox', verb: 'count' }, function (res) {
						countSession = res.count;
						elem.html(format(countSession));
					});
				}

				function format(count) {
					if (count === 0) {
						return;
					}

					return '<span class="inbox-counter">' + (count <= 1000 ? count : '1000 +') + '</span>';
				}
			}
		};
	}

	return InboxCounter;
});