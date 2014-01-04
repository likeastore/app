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
				$location.path('/');
			});

		};
	}

	return DribbbleNetworkController;
});