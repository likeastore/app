define(function (require) {
	var resource = require('ngResource');
	var angular = require('angular');

	function initialize () {
		angular.module('likeastore.services', ['ngResource'])
			.factory('api', function ($resource) {
				return $resource('/api/items/:target', {}, {
					update: { method: 'PUT' }
				});
		});
	}

	return {
		initialize: initialize
	};
});
