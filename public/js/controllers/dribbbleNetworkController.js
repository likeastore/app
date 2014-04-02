define(function (require) {
	'use strict';

	function DribbbleNetworkController($scope, $timeout, api, ngProgressLite, ngDialog, $analytics, user) {
		var timer;

		$scope.$watch('username', function (value) {
			if (timer) {
				$timeout.cancel(timer);
			}

			if (value) {
				timer = $timeout(function () {
					$scope.dribbbleUser = api.get({ resource: 'networks', target: 'dribbble', verb: $scope.username });
				}, 500);
			}
		});

		$scope.turnOn = function () {
			ngProgressLite.start();

			api.save({ resource: 'networks', target: 'dribbble' }, { username: $scope.username }, function (res) {
				user.getActiveNetworks();

				$analytics.eventTrack('network enabled');
				ngProgressLite.done();
				ngDialog.close();
			});
		};
	}

	return DribbbleNetworkController;
});