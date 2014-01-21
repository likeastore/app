define(function (require) {
	'use strict';

	function Touchy () {
		return {
			restrict: 'A',
			link: function (scope, elem, attr) {
				elem.parent('li').on('touchend', function () {
					elem.css('visibility', 'visible');
				});
			}
		};
	}

	return Touchy;
});