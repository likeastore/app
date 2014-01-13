define(function () {
	'use strict';

	var boot = {
		getAccessToken: function (callback) {
			var params = this.getQueryParams();

			if (params.email && params.apiToken) {
				this.request('POST', '/api/auth/login', params, function (res) {
					if (res.status === 201) {
						var date = new Date();
						var domain = window.appConfig.env = 'development' ? '' : '.likeastore.com';

						date.setTime(date.getTime() + (30*24*60*60*1000)); // set cookie for one month
						document.cookie = 'token=' +  res.token + '; expires=' + date.toGMTString() + '; domain=' + domain;

						window.location = window.location.origin;
					} else {
						window.location = res.error.redirectUrl + '/login';
					}
				});
			} else {
				document.getElementById('resourceLoader').style.display = 'none';
				document.getElementById('likeastoreApp').style.display = 'block';
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
