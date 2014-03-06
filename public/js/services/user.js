define(function (require) {
	'use strict';

	var angular = require('angular');

	function User ($rootScope, $location, $window, api, storage, auth, _) {
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
			}
		};
	}

	return User;
});