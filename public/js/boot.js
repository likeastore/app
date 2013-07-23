define(function (require) {
	'use strict';

	var boot = {
		getAccessToken: function (callback) {
			var params = this.getQueryParams();

			if (params.email && params.apiToken) {
				this.request('POST', '/api/auth/login', params, function (res) {
					if (res.status === 201) {
						document.cookie = 'token=' +  res.token;
						window.location = window.location.origin;
					} else {
						window.location = res.error.redirectUrl + '/login';
					}
				});
			} else {
				document.getElementById('resource-loader').style.display = 'none';
				callback();
			}
		},

		request: function (type, url, opts, callback) {
			var xhr = new XMLHttpRequest();
			var data;

			if (typeof opts === 'function') {
				callback = opts;
				opts = null;
			}

			xhr.open(type, url);

			if (type === 'POST' && opts) {
				data = JSON.stringify(opts);
				xhr.setRequestHeader('Content-Type', 'application/json');
			}

			xhr.onload = function () {
				var response = JSON.parse(xhr.response);

				response.status = xhr.status;
				callback(response);
			};

			xhr.send(opts ? data : null);
		},

		getQueryParams: function () {
			var query = window.location.search.replace('?', '').split('&');
			var obj = {};

			for (var i = 0; i < query.length; i++) {
				var param = query[i].split('=')[0];
				var value = query[i].split('=')[1];
				obj[param] = value;
			}

			return obj;
		}
	};

	return boot;

});