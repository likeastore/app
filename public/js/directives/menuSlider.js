define(function (require) {
	'use strict';

	function MenuSlider () {
		return {
			restrict: 'A',
			link: function (scope, elem, attrs, ctrl) {
				scope.toggleBar = function () {
					elem.parent().toggleClass('compact-view');
				};
			}
		};
	}

	return MenuSlider;
});