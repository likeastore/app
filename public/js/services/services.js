define(function (require) {
	'use strict';

	var angular = require('angular');
	var resource = require('ngResource');
	var cookies = require('ngCookies');

	var services = angular.module('services', ['ngResource', 'ngCookies']);

	services.factory('api', require('./api'));
	services.factory('auth', require('./auth'));
	services.factory('authInterceptor', require('./authInterceptor'));
	services.factory('appLoader', require('./appLoader'));
	services.factory('user', require('./user'));

	return services;
});