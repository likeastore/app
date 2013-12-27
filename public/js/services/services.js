define(function (require) {
	'use strict';

	require('ngResource');
	require('ngCookies');

	var angular = require('angular');
	var services = angular.module('services', ['ngResource', 'ngCookies']);

	services.factory('api', require('./api'));
	services.factory('auth', require('./auth'));
	services.factory('httpInterceptor', require('./httpInterceptor'));
	services.factory('appLoader', require('./appLoader'));
	services.factory('user', require('./user'));
	services.factory('links', require('./links'));

	return services;
});