define(function (require) {
	'use strict';

	function AppLoader ($timeout, $rootScope) {
		var timer;

		return {
			ready: function (delay) {
				if (!delay || typeof delay !== 'number') {
					return ready();
				}

				timer = $timeout(ready, delay);

				function ready () {
					$timeout.cancel(timer);
					$rootScope.loaded = true;
				}
			},
			loading: function () {
				$timeout.cancel(timer);
				$rootScope.loaded = false;
			}
		};
	}

	return AppLoader;
});