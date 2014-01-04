define(function (require) {
	'use strict';

	function DribbbleNetworkController($scope, $location, api, ngProgressLite, ngDialog) {
		$scope.turnOn = function () {
			var payload = {username: this.username};
			var urlOptions = { resource: 'networks', target: 'dribbble' };

			ngProgressLite.start();
			api.save(urlOptions, payload, function () {
				ngProgressLite.done();
				ngDialog.close();
				// TODO: Fix me, instead of redirect - it should be update on models on settings page..
				$location.path('/');
			});

		};
	}

	return DribbbleNetworkController;
});