define(function (require) {
	'use strict';

	return function ($rootScope, Intercom) {
		return {
			boot: function () {
				$rootScope.$watch('user', function (user) {
					if (user && window.appConfig.env === 'production') {
						console.log('intercom boot', window.appConfig.env);
						Intercom.boot({
							app_id: '8aa471d88de92f2f1f1a2fc08438fc69f4d9146e',
							email: user.email,
							created_at: Math.round(new Date(user.registered).getTime()/1000),
							widget: {activator: '#IntercomDefaultWidget'}
						});
					}
				});
			}
		};
	};
});