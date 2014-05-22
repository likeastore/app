define(function (require) {
	'use strict';

	return function ($rootScope, Intercom, mixpanel) {
		return {
			boot: function () {
				$rootScope.$watch('user', function (user) {
					if (user && window.appConfig.tracking) {


						mixpanel.alias(user.email);
						mixpanel.people.set({
							'$email': user.email,
							'$created': new Date(user.registered),
							'$last_login': new Date()
						});
					}
				});
			},

			deleteAccount: function () {
				if (window.appConfig.tracking) {
					Intercom.update({deleted: true});
				}
			}
		};
	};
});
