'use strict'

angular.module('likeastore.services', ['ngResource'])
	.factory('api', function ($resource) {
		return $resource('/api/items/:target', {}, {
			update: { method: 'PUT' }
		});
});