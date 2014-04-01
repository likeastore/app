define(function () {
	'use strict';

	return function ($window) {
		return {
			init: function () {
				FB.init({
					appId: $window.appConfig.appId
				});
			}
		};
	};
});