define(function (require) {
	'use strict';

	var count;

	function InboxCounter(api) {
		return {
			restrict: 'A',
			link: function (scope, elem) {
				if (count) {
					elem.text('(' + format(count) + ')');
				} else {
					api.get({resource: 'items', target: 'inbox', verb: 'count'}, function(res) {
						count = res.count;
						elem.text('(' + format(res.count) + ')');
					});
				}

				function format(count) {
					return count <= 1000 ? count : '1000+';
				}
			}
		};
	}

	return InboxCounter;
});