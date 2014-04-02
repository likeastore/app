define(function (require) {
	'use strict';

	var angular = require('angular');

	function User ($rootScope, $location, $window, api, storage, auth) {
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

					// track view mode on screen resize
					// update: move to directive
					listenViewWidth();
					angular.element($window).on('resize', function () {
						listenViewWidth();
						$rootScope.$apply();
					});

					function listenViewWidth () {
						if ($window.innerWidth <= 700) {
							$rootScope.user.viewMode = 'list';
						}
					}
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

					if (_.isUndefined($rootScope.user.blockNetworks)) {
						$rootScope.user.blockNetworks = networks.length >= 3 ? true : void 0;
					}

					$rootScope.stringifiedNetworks = _(networks).map(getNames).toString();
					function getNames (row) {
						return row.service;
					}
				});

				return this;
			},

			getInboxCount: function () {
				api.get({ resource: 'items', target: 'inbox', verb: 'count' }, function (res) {
					$rootScope.inboxCount = res.count <= 1000 ? res.count : '1000 +';
				});

				return this;
			},

			unblockConnections: function () {
				api.patch({ resource: 'users', target: 'me' }, { blockNetworks: false }, function (user) {
					$rootScope.user = user;
				});

				return this;
			},

			addBadge: function (type) {
				api.patch({ resource: 'users', target: 'me' }, { badges: [type] }, function (user) {
					$rootScope.user = user;
				});

				return this;
			}
		};
	}

	return User;
});