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
		};
	};
});
