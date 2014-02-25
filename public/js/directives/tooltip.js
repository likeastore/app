define(function (require) {
	'use strict';

	function Tooltip ($window, $rootScope) {
		return {
			restrict: 'A',
			compile: function (element, attrs) {
				element.addClass('tooltipped');
				element.append('<div class="tooltip">' + attrs.tooltip + '</div>');
			}
		};
	}

	return Tooltip;
});