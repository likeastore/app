define(function (require) {
	'use strict';

	function User ($rootScope, $templateCache, api) {
		return {
			initialize: function () {
				api.get({ resource: 'users', target: 'me' }, function (res) {
					$rootScope.user = res;
					$rootScope.intercom = $templateCache.get('intercomTemplate')
											.replace('[email]', res.email)
											.replace('[timestamp]', Math.round(new Date().getTime()/1000));
				});
			}
		};
	}

	return User;
});