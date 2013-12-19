define(function (require) {
	'use strict';

	var count;

	function InboxCounter(api) {
		return {
			restrict: 'A',
			link: function (scope, elem) {
				if (count) {
					elem.text('(' + count + ')');
				} else {
					api.get({resource: 'items', target: 'inbox', verb: 'count'}, function(res) {
						count = res.count;
						elem.text('(' + res.count + ')');
					});
				}
			}
		};
	}

	return InboxCounter;
});