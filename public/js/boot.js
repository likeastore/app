define(function (require) {
	'use strict';

	return {
		getAccessToken: function (callback) {
			var params = {
				email: getParamByName('email'),
				apiToken: getParamByName('apiToken')
			};

			if (params.email && params.apiToken) {
				var xhr = new XMLHttpRequest();
				xhr.open('POST', '/api/auth/login');
				xhr.setRequestHeader('Content-Type', 'application/json');
				xhr.onload = function () {
					var response = JSON.parse(this.response);
					if (this.status === 201) {
						document.cookie = 'token=' +  response.token;
						callback();
					} else {
						window.location = response.error.redirectUrl + '/login';
					}
				};
				xhr.send(JSON.stringify(params));
			} else {
				callback();
			}

			function getParamByName (name) {
				var match = new RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
				return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
			}
		}
	};

});