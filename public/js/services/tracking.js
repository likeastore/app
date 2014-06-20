define(function (require) {
	'use strict';

	return function ($rootScope, Intercom, mixpanel) {
		return {
			boot: function () {
				$rootScope.$watch('user', function (user) {
					if (user && window.appConfig.tracking) {
						Intercom.boot({
							app_id: '8aa471d88de92f2f1f1a2fc08438fc69f4d9146e',
							email: user.email,
							created_at: Math.round(new Date(user.registered).getTime()/1000)
						});

						mixpanel.alias(user.email);
						mixpanel.identify(user.email);

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
