define(function (require) {
	'use strict';

	var angular = require('angular');

	function DribbbleNetworkController($scope, $rootScope, $timeout, api, ngProgressLite, ngDialog) {
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
				var persistWarningFor = [];

				angular.forEach($rootScope.networks, function (row) {
					if (row.service === 'dribbble' && row.disabled) {
						row.disabled = false;
					}

					if (row.disabled) {
						persistWarningFor.push(row);
					}
				});

				if (persistWarningFor.length === 0) {
					$rootScope.user.warning = false;
				}

				$rootScope.networks.push({ service: 'dribbble' });

				ngProgressLite.done();
				ngDialog.close();
			});
		};
	}

	return DribbbleNetworkController;
});