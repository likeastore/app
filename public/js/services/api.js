define(function (require) {
	'use strict';

	function api ($resource) {
		return $resource('/api/:resource/:target', {}, {
			update: { method: 'PUT' }
		});
	}

	return api;
});
