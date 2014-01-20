define(function (require) {
	'use strict';

	function api ($resource) {
		return $resource('/api/:resource/:target/:verb', {}, {
			update: { method: 'PUT' },
			post: { method: 'POST' }, // just an alias for 'save'
			cacheGet: { method: 'GET', cache: true },
			cacheQuery: { method: 'GET', isArray: true, cache: true }
		});
	}

	return api;
});
