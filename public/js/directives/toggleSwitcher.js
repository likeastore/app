define(function (require) {
	'use strict';

	var angular = require('angular');

	function ToggleSwitcher ($window, api) {
		return {
			restrict: 'A',
			replace: true,
			scope: {
				networks: '=model'
			},
			template: '\
				<div class="toggle">\
					<input type="checkbox" name="toggleSwitcher" ng-click="toggleNetwork()">\
					<span class="btn"></span>\
					<span class="texts" data-on="On" data-off="Off"></span>\
					<span class="bg"></span>\
				</div>',
			link: function (scope, elem, attrs) {
				var service = attrs.toggleSwitcher;

				scope.toggleNetwork = function () {
					var isOn = elem.hasClass('on');

					elem.toggleClass('on');

					if (isOn) {
						api.remove({ resource: 'networks', target: scope.networks[service].id });
						return;
					}
					$window.location = '/connect/' + service;
				};

				function listenToNetworks (value) {
					if (value) {
						angular.forEach(value, function (row, i) {
							if (service === row.service) {
								elem.addClass('on');
							}
						});
					}
				}
				scope.$watch(attrs.model, listenToNetworks, true);
			}
		};
	}

	return ToggleSwitcher;
});