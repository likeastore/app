define(function (require) {
	'use strict';

	var angular = require('angular');
	var plugin = angular.module('ngCustomerVoice', ['ngDialog']);

	plugin.provider('ngCustomerVoice', function () {
		var url = null;

		this.apiUrl = function (_url) {
			url = _url || url;
		};

		this.$get = ['$http', 'ngDialog', function ($http, ngDialog) {
			return {
				$sendEmail: function (data) {
					if (!url) {
						throw new Error('Please setup feedback API uri with "ngCustomerVoiceProvider"');
					}
					if (!data || typeof data !== 'object') {
						throw new Error('Data object is required');
					}
					if (!data.message || typeof data.message !== 'string') {
						throw new Error('Message string is required');
					}

					return this.$$makeRequest(data);
				},

				$cancel: function () {
					ngDialog.closeAll();
				},

				$$makeRequest: function (data, callback) {
					return $http({
						method: 'POST',
						url: url,
						headers: {'Content-Type': 'application/json'}
					}, data).then(function () {
						ngDialog.closeAll();
					});
				}
			};
		}];
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
						ngCustomerVoice.$sendEmail({ message: message, from: $scope.email });
					};
				}
			};
		}
	]);

	return plugin;
});
