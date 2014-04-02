define(function () {
	'use strict';

	return function ($window) {
		return {
			init: function () {
				FB.init({
					appId: $window.appConfig.appId,
					status: true,
					xfbml: true
				});
			},
			share: function (options, callback) {
				if (!options || typeof options !== 'object') {
					throw new Error('options are required, https://developers.facebook.com/docs/javascript/reference/FB.ui');
				}

				_(options).extend({ method: 'feed' });

				FB.ui(options, function (res) {
					if (res && res.post_id) {
						options.success && options.success(res);
					} else {
						options.error && options.error(res);
					}
				});
			}
		};
	};
});