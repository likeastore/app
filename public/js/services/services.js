define(function (require) {
	var angular = require('angular');
	var resource = require('ngResource');

	var api = require('./api');
	var authInterceptor = require('./authInterceptor');

	var services = angular.module('services', ['ngResource']);

	services.factory('api', api);
	services.factory('authInterceptor', authInterceptor);

	return services;
});