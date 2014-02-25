define(function (require) {
	'use strict';

	var angular = require('angular');

	function SortByType () {
		return function (items, types) {
			var filtered = [];

			angular.forEach(types, function (value, key) {
				if (value) {
					for (var i = 0; i < items.length; i++) {
						var item = items[i];
						if (item.type === key) {
							filtered.push(item);
						}
					}
				}
			});

			return filtered.length ? filtered : items;
		};
	}

	return SortByType;
});