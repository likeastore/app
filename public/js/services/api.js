define(function (require) {
	return function ($resource) {
		return $resource('/api/items/:target', {}, {
			update: { method: 'PUT' }
		});
	}
});
