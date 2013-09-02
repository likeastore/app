define(function (require) {
	'use strict';

	function api ($resource) {
		return $resource('/api/:resource/:target', {}, {
			query: { method: 'GET', isArray: false },
			update: { method: 'PUT' }
		});
	}

	return api;
});
