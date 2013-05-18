define(function (require) {
	'use strict';

	function AppLoader ($rootScope) {
		var timer;

		return {
			ready: function (delay) {
				if (!delay || typeof delay !== 'number') {
					return ready();
				}

				timer = setTimeout(ready, delay);

				function ready () {
					clearTimeout(timer);
					$rootScope.loaded = true;
				}
			},
			loading: function () {
				clearTimeout(timer);
				$rootScope.loaded = false;
			}
		};
	}

	return AppLoader;
});