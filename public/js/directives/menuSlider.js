define(function (require) {
	'use strict';

	var angular = require('angular');

	function MenuSlider () {
		return {
			restrict: 'A',
			link: function (scope, elem, attrs, ctrl) {
				scope.toggleBar = function () {
					angular.element(elem).parent().toggleClass('compact-view');
				};
			}
		};
	}

	return MenuSlider;
});