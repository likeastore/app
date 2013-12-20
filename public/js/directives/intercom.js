define(function (require) {
	'use strict';

	function InboxCounter($rootScope) {
		return {
			restrict: 'A',
			link: function (scope, elem, attr) {
				elem.html('alert(' + $rootScope.user.email + ')');
			}
		};
	}

	return InboxCounter;
});