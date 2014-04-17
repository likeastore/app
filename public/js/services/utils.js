define(function () {
	'use strict';

	return function ($rootScope, $document, $location) {
		return function () {
			$rootScope.switchMenu = function (url) {
				$location.url(url);
			};

			$rootScope.createFirstCollection = function () {
				$document.find('body').addClass('sidebar-active');
				$rootScope.showAddForm = true;
			};

			$rootScope.showConfigTab = true;
			$rootScope.toggleConfig = function () {
				$rootScope.showConfigTab = $rootScope.showConfigTab ? false : true;
			};

			$rootScope.goToConfig = function () {
				$location.url('/settings');
				$rootScope.showConfigTab = true;
			};

			$rootScope.kFormat = function(num) {
				return num > 999 ? (num/1000).toFixed() + 'k' : num;
			};

			$rootScope.hexToRGBString = function (hex) {
				var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
				hex = hex.replace(shorthandRegex, function(m, r, g, b) {
					return r + r + g + g + b + b;
				});

				var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
				return result ?
					[parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)].join() :
					null;
			};
		};
	};
});
