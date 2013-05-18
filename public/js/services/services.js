define(function (require) {
	'use strict';

	var angular = require('angular');
	var resource = require('ngResource');

	var services = angular.module('services', ['ngResource']);

	services.factory('api', require('./api'));
	services.factory('authInterceptor', require('./authInterceptor'));

	return services;
});