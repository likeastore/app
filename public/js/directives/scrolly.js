define(function (require) {
	'use strict';

	var angular = require('angular');

	function Scrolly () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var raw = element[0];

				element.bind('scroll', function () {
					if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight - 200) {
						// hack for getting proper scroll scope
						var childScope = angular.element(document.getElementById('items')).scope();

						if (!childScope || !childScope.nextPage) {
							return;
						}

						childScope.$apply(attrs.scrolly);
					}
				});
			}
		};
	}

	return Scrolly;
});
