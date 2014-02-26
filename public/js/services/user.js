define(function (require) {
	'use strict';

	function User ($rootScope, api, storage, auth) {
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
					$rootScope.user.changeView = function (view) {
						storage.set('list-view', view);
						$rootScope.user.viewMode = view;
					};

					$rootScope.user.logout = function () {
						auth.logout();
					};
				});

				return this;
			},

			getCollections: function () {
				api.query({ resource: 'collections' }, function (collections) {
					$rootScope.collections = collections;
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