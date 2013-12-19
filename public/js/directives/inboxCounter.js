define(function (require) {
	'use strict';

	function InboxCounter(api) {
		return {
			restrict: 'A',
			link: function (scope, elem) {
				api.
				elem.text('(0)');
			}
		};
	}

	return InboxCounter;
});