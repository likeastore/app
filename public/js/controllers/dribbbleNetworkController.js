define(function (require) {
	'use strict';

	function DribbbleNetworkController($scope, api, ngProgressLite, ngDialog) {
		$scope.turnOn = function () {
			var payload = {username: this.username};
			var urlOptions = { resource: 'networks', target: 'dribbble' };

			ngProgressLite.start();
			api.save(urlOptions, payload, function () {
				ngProgressLite.done();
				ngDialog.close();
			});

		};
	}

	return DribbbleNetworkController;
});