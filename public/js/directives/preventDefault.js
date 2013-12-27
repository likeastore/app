define(function (require) {
	'use strict';

	function PreventDefault ($window) {
		return {
			restrict: 'A',
			link: function (scope, elem, attr) {
				elem.on('click', function (e) {
					e.preventDefault();
				});
			}
		};
	}

	return PreventDefault;
});