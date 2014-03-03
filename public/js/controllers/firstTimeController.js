define(function () {
	'use strict';

	function FirstTimeController ($scope) {
		$scope.goToSlide = function (slide) {
			$scope.slideTwo = true;
		};
	}

	return FirstTimeController;
});