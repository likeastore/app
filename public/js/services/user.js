define(function (require) {
	'use strict';

	function User ($rootScope, api, storage) {
		return {
			initialize: function () {
				api.get({ resource: 'users', target: 'me' }, function (user) {
					if (!user.follows) {
						user.follows = [];
					}

					if (!user.followed) {
						user.followed = [];
					}

					$rootScope.user = user;
					$rootScope.user.viewMode = storage.get('list-view') || 'grid';
				});

				return this;
			},

			getActiveNetworks: function () {
				api.query({ resource: 'networks' }, function (networks) {
					$rootScope.networks = networks;
				});

				return this;
			},

			getInboxCount: function () {
				api.get({ resource: 'items', target: 'inbox', verb: 'count' }, function (res) {
					$rootScope.inboxCount = res.count <= 1000 ? res.count : '1000 +';
				});

				return this;
			}
		};
	}

	return User;
});