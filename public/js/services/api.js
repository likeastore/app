define(function (require) {
	'use strict';

	function api ($resource) {
		return $resource('/api/:resource/:target/:verb', {}, {
			update: { method: 'PUT' }
		});
	}

	return api;
});
