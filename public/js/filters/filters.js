define(function (require) {
	'use strict';

	var angular = require('angular');
	var filters = angular.module('filters', []);

	filters.filter('truncate', require('./truncate'));
	filters.filter('linkify', require('./linkify'));

	return filters;
});
