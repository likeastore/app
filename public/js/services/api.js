define(function (require) {
	return function ($resource) {
		return $resource('/api/:resource/:target', {}, {
			update: { method: 'PUT' }
		});
	};
});
