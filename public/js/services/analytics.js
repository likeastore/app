define(function (require) {
	'use strict';

	var seismo = require('seismo');

	function Analytics($window) {
		var options = {
			server: $window.appConfig.analytics.url,
			credentials: {
				username: $window.appConfig.analytics.username,
				password: $window.appConfig.analytics.password,
			}
		};

		var client = seismo($window.appConfig.analytics.application, options);

		return {
			track: function(e, data, callback) {
				client(e, data || {}, function (err) {
					if (err) {
						console.error(err);
					}

					callback && callback(err);
				});
			}
		};
	}

	return Analytics;
});