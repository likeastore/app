define(function (require) {
	'use strict';

	var angular = require('angular');

	function ToggleSwitcher ($window, $rootScope, api, user, ngProgressLite, ngDialog, $analytics) {
		return {
			restrict: 'A',
			replace: true,
			scope: {},
			template: '\
				<div class="toggle">\
					<input type="checkbox" id="{{service}}ToggleSwitcher" ng-click="toggleNetwork()">\
					<label for="{{service}}ToggleSwitcher" class="btn"></label>\
					<span class="texts" data-on="On" data-off="Off"></span>\
					<span class="bg"></span>\
				</div>',
			link: function (scope, elem, attrs) {
				var service = scope.service = attrs.toggleSwitcher;
				var urlOptions = { resource: 'networks', target: service };
				var parent = elem.parent();
				var index;

				scope.toggleNetwork = function () {
					var isOn = elem.hasClass('on');
					var isDisabled = elem.hasClass('disabled');

					if (isDisabled) {
						return;
					}

					if (isOn) {
						elem.addClass('disabled');
						api.remove(urlOptions, function (res) {
							user.getInboxCount();

							$rootScope.networks.splice(index, 1);
							elem.toggleClass('on');
							elem.removeClass('disabled');
						});
						return;
					}

					if (attrs.dialogTemplate) {
						return dialogAuth(attrs.dialogTemplate);
					}

					return redirectAuth();

					function redirectAuth() {
						elem.toggleClass('on');
						elem.addClass('disabled');

						ngProgressLite.start();
						api.save(urlOptions, {}, function (res) {
							$window.location = res.authUrl;
							$analytics.eventTrack('network enabled');
							ngProgressLite.set(0.99);
						});
					}

					function dialogAuth(dialogTmpl) {
						ngDialog.open({
							template: dialogTmpl,
							className: 'lsd-theme share-dialog ' + service + '-connect-dialog',
							controller: attrs.dialogController,
							scope: scope
						});
					}
				};

				$rootScope.$watch('networks', listenToNetworks, true);

				function listenToNetworks (value) {
					if (value) {
						angular.forEach(value, function (row, i) {
							if (service === row.service){
								index = i;
							}

							if (!row.disabled && service === row.service) {
								elem.addClass('on');
								parent.removeClass('disabled');
							}

							if (row.disabled && service === row.service) {
								parent.addClass('disabled');
								parent.prepend('<div class="font-icon temp-disabled-icon tooltipped"><div class="tooltip">Disabled</div></div>');
							}
						});
					}
				}
			}
		};
	}

	return ToggleSwitcher;
});