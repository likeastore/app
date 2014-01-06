define(function (require) {
	'use strict';

	function User ($rootScope, $templateCache, api) {
		return {
			initialize: function () {
				api.get({ resource: 'users', target: 'me' }, function (user) {
					$rootScope.user = user;
					window.Intercom('boot', {
						app_id: '8aa471d88de92f2f1f1a2fc08438fc69f4d9146e',
						email: user.email,
						created_at: Math.round(new Date().getTime()/1000),
						widget: {activator: '#IntercomDefaultWidget'}
					});
				});
			}
		};
	}

	return User;
});