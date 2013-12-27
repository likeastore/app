define(function (require) {
	'use strict';

	function PreventDefault () {
		return {
			restrict: 'A',
			link: function (scope, elem, attr) {
				elem.on('click', function (e) {
					e.preventDefault();
					e.stopPropagation();
				});
			}
		};
	}

	return PreventDefault;
});