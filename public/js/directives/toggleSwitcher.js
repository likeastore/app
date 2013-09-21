define(function (require) {
	'use strict';

	var angular = require('angular');

	function ToggleSwitcher ($window, api, ngProgress) {
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
				var urlOptions = {
					resource: 'networks',
					target: service
				};

				scope.toggleNetwork = function () {
					var isOn = elem.hasClass('on');
					var isDisabled = elem.hasClass('disabled');

					if (isDisabled) {
						return;
					}

					elem.toggleClass('on');

					if (isOn) {
						api.remove(urlOptions);
						return;
					}

					ngProgress.color('#e76049');
					ngProgress.start();

					elem.addClass('disabled');

					api.save(urlOptions, {}, function (res) {
						ngProgress.complete();
						$window.location = res.authUrl;
					});
				};

				scope.$watch(attrs.model, listenToNetworks, true);

				function listenToNetworks (value) {
					if (value) {
						angular.forEach(value, function (row, i) {
							if (!row.disabled && service === row.service) {
								elem.addClass('on');
							}

							if (row.disabled && service === row.service) {
								var parent = elem.parent();
								parent.addClass('disabled');
								parent.append('<div class="expired-token-notifier">Temporary disabled</div>');
							}
						});
					}
				}
			}
		};
	}

	return ToggleSwitcher;
});