define(function (require) {
	var angular = require('angular');
	var resource = require('ngResource');

	var api = require('./api');

	var services = angular.module('services', ['ngResource']);

	services.factory('api', api);

	return services;
});