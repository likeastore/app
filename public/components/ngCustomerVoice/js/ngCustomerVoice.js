(function (window, angular, undefined) {
	'use strict';

	var plugin = angular.module('ngCustomerVoice', ['ngDialog']);

	plugin.provider('ngCustomerVoice', function () {
		var url = false;
		var closeBeforeSend = false;

		this.apiUrl = function (_url) {
			url = _url || url;
		};

		this.closeBeforeSend = function (_close) {
			closeBeforeSend = _close || closeBeforeSend;
		};

		this.$get = ['$http', 'ngDialog',
			function ($http, ngDialog) {
				return {
					/**
					 * Send request to server with email data
					 * @data {Object}
					 *  - message - text message that user sends (required)
					 *  - from - it can be any user identifier (optional, this can be handled on server)
					 */
					sendEmail: function (data) {
						if (!url) {
							throw new Error('Please setup feedback API uri with "ngCustomerVoiceProvider"');
						}
						if (!data || typeof data !== 'object') {
							throw new Error('Data object is required');
						}
						if (!data.message || typeof data.message !== 'string') {
							throw new Error('Message string is required');
						}

						if (closeBeforeSend) {
							ngDialog.closeAll();
						}

						return this._makeRequest(data);
					},

					_makeRequest: function (data) {
						return $http({
							method: 'POST',
							url: url,
							data: data,
							headers: {'Content-Type': 'application/json'}
						}).then(function () {
							ngDialog.closeAll();
						});
					}
				};
			}
		];
	});

	var dialogTmpl = '\
		<div class="ngdialog-header">\
			New message to support\
		</div>\
		<div class="ngdialog-message">\
			<form ng-submit="send(message)">\
				<textarea rows="10" ng-model="message" placeholder="Write your message..." required></textarea>\
				<button type="submit" class="ngdialog-button" ng-disabled="!message">Send</button>\
			</form>\
		</div>';

	plugin.directive('ngCustomerVoice', ['ngDialog', 'ngCustomerVoice',
		function (ngDialog, ngCustomerVoice) {
			return {
				restrict: 'EA',
				scope: {
					email: '=ngCustomerVoice'
				},
				replace: true,
				template: '\
					<div class="ngcustomer-voice-block" ng-click="showDialog()">\
						<div class="ngcustomer-voice-icon">?</div>\
					</div>',
				controller: function ($scope) {
					$scope.showDialog = function () {
						ngDialog.open({
							scope: $scope,
							className: 'ngdialog-theme-customer-voice',
							plain: true,
							template: dialogTmpl
						});
					};

					$scope.send = function (message) {
						ngCustomerVoice.sendEmail({ message: message, from: $scope.email });
					};
				}
			};
		}
	]);

	return plugin;

})(window, window.angular);
