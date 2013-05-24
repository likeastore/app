define(function (require) {
	'use strict';

	function Preloader ($rootScope) {
		return {
			restrict: 'A',
			link: function (scope, elem, attrs) {}
		};
	}

	return Preloader;
});