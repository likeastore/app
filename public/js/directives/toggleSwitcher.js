define(function (require) {
	'use strict';

	var angular = require('angular');

	function ToggleSwitcher ($window, api, ngProgressLite, ngDialog) {
		return {
			restrict: 'A',
			replace: true,
			scope: {
				networks: '=model'
			},
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

				scope.toggleNetwork = function () {
					var isOn = elem.hasClass('on');
					var isDisabled = elem.hasClass('disabled');

					if (isDisabled) {
						return;
					}

					if (isOn) {
						elem.toggleClass('on');
						api.remove(urlOptions);
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
							ngProgressLite.set(0.99);
						});
					}

					function dialogAuth(dialogTmpl) {
						ngDialog.open({
							template: dialogTmpl,
							className: 'lsd-theme share-dialog ' + service + '-connect-dialog',
							controller: attrs.dialogController
						});
					}
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